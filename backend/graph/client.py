"""Neo4j graph database store with mock fallback execution."""

from typing import Any, Dict, List
from backend.config.settings import get_settings


class Neo4jGraphStore:
    """Manages connection to Neo4j knowledge graph database

    and implements an in-memory graph fallback database for local offline mode.
    """

    def __init__(self) -> None:
        self.settings = get_settings()
        self.uri = self.settings.neo4j_uri
        self.username = self.settings.neo4j_username
        self.password = self.settings.neo4j_password

        self.driver = None
        self.enabled = False

        # In-memory mock database for fallback testing
        self._mock_nodes = {}  # {node_id: {"label": str, "properties": dict}}
        self._mock_edges = []  # [{"source": str, "target": str, "type": str, "properties": dict}]

        try:
            from neo4j import GraphDatabase

            self.driver = GraphDatabase.driver(
                self.uri, auth=(self.username, self.password)
            )
            self.driver.verify_connectivity()
            self.enabled = True
        except Exception as exc:
            print(
                f"Neo4j connectivity check failed: {exc}. Using in-memory graph fallback database."
            )
            self.enabled = False

    def close(self) -> None:
        """Close driver connections."""

        if self.driver:
            self.driver.close()

    def query(
        self, cypher: str, parameters: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """Run Cypher query against Neo4j, falling back to mock graph query resolver if offline."""

        if self.enabled and self.driver:
            try:
                with self.driver.session() as session:
                    result = session.run(cypher, parameters or {})
                    return [record.data() for record in result]
            except Exception as exc:
                print(f"Neo4j query failed: {exc}")

        return self._mock_query_resolver(cypher, parameters)

    def add_node(self, label: str, node_id: str, properties: Dict[str, Any]) -> None:
        """Create or update a node in the graph."""

        props = properties or {}
        props["id"] = node_id

        if self.enabled and self.driver:
            cypher = f"MERGE (n:{label} {{id: $id}}) SET n += $props"
            self.query(cypher, {"id": node_id, "props": props})
            return

        self._mock_nodes[node_id] = {"label": label, "properties": props}

    def add_relationship(
        self,
        source_id: str,
        target_id: str,
        rel_type: str,
        properties: Dict[str, Any] = None,
    ) -> None:
        """Create a directed relationship from source to target node."""

        props = properties or {}

        if self.enabled and self.driver:
            cypher = (
                f"MATCH (a {{id: $source_id}}), (b {{id: $target_id}}) "
                f"MERGE (a)-[r:{rel_type}]->(b) "
                f"SET r += $props"
            )
            self.query(
                cypher,
                {
                    "source_id": source_id,
                    "target_id": target_id,
                    "props": props,
                },
            )
            return

        self._mock_edges.append(
            {"source": source_id, "target": target_id, "type": rel_type, "properties": props}
        )

    def _mock_query_resolver(
        self, cypher: str, parameters: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """Mock Cypher lookup returns nodes and properties matches from memory."""

        results = []
        cypher_lower = cypher.lower()

        # heuristic for matching nodes
        if "match (n" in cypher_lower:
            for n_data in self._mock_nodes.values():
                results.append({"n": n_data["properties"]})
        # heuristic for matching relations
        elif "-[r:" in cypher_lower:
            for edge in self._mock_edges:
                src_props = self._mock_nodes.get(edge["source"], {}).get(
                    "properties", {}
                )
                tgt_props = self._mock_nodes.get(edge["target"], {}).get(
                    "properties", {}
                )
                results.append(
                    {
                        "source": src_props,
                        "target": tgt_props,
                        "rel": {"type": edge["type"]},
                    }
                )

        return results
