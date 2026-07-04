"""Knowledge Graph Extraction Service for building Neo4j nodes and edges."""

import re
from typing import List

from backend.graph.client import Neo4jGraphStore


class GraphExtractorService:
    """Parses text chunks to extract entities (People, Projects, Policies, Tech)

    and constructs their semantic relationship maps in Neo4j.
    """

    def __init__(self, graph_store: Neo4jGraphStore | None = None) -> None:
        self.graph_store = graph_store or Neo4jGraphStore()

    def process_chunk(self, chunk_content: str, department: str | None = None) -> None:
        """Extract entities and add node/relationship linkages to Neo4j."""

        # 1. Extract Entities
        # Departments
        depts = ["hr", "engineering", "sales", "finance", "compliance", "marketing", "legal", "it"]
        found_depts = []
        for d in depts:
            if re.search(r"\b" + re.escape(d) + r"\b", chunk_content.lower()):
                dept_name = d.upper() if d == "it" else d.capitalize()
                found_depts.append(dept_name)
                self.graph_store.add_node("Department", dept_name, {"name": dept_name})

        # People (Firstname Lastname capitalization pattern)
        name_pattern = re.compile(r"\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b")
        people = name_pattern.findall(chunk_content)
        found_people: List[str] = []
        for first, last in people:
            full_name = f"{first} {last}"
            # Exclude standard text fillers
            if full_name.lower() not in [
                "john doe",
                "jane doe",
                "page number",
                "document name",
            ]:
                found_people.append(full_name)
                # Simple manager heuristic
                is_manager = False
                role = "Employee"
                if re.search(
                    r"\b(manager|director|lead|vp|head)\b", chunk_content.lower()
                ):
                    is_manager = True
                    role = "Manager"
                self.graph_store.add_node(
                    "Person",
                    full_name,
                    {"name": full_name, "role": role, "is_manager": is_manager},
                )

        # Projects ("Project <Name>")
        project_pattern = re.compile(r"\bProject\s+([A-Z][a-zA-Z0-9_-]+)\b")
        projects = project_pattern.findall(chunk_content)
        for proj in projects:
            self.graph_store.add_node("Project", proj, {"name": proj})

        # Policies (e.g. "Security Policy", "Travel Policy")
        policy_pattern = re.compile(r"\b([A-Z][a-zA-Z0-9_\-\s]+Policy)\b")
        policies = policy_pattern.findall(chunk_content)
        for pol in policies:
            self.graph_store.add_node("Policy", pol, {"name": pol})

        # Technologies
        techs = ["python", "neo4j", "qdrant", "postgresql", "fastapi", "react", "docker", "kubernetes"]
        found_techs = []
        for t in techs:
            if re.search(r"\b" + re.escape(t) + r"\b", chunk_content.lower()):
                tech_name = t.capitalize()
                found_techs.append(tech_name)
                self.graph_store.add_node("Technology", tech_name, {"name": tech_name})

        # 2. Build Relationships
        # Link People to Department
        if department:
            dept_name = department.capitalize()
            self.graph_store.add_node("Department", dept_name, {"name": dept_name})
            for person in found_people:
                self.graph_store.add_relationship(person, dept_name, "BELONGS_TO")

        # Link People to Projects
        for person in found_people:
            for proj in projects:
                self.graph_store.add_relationship(person, proj, "WORKS_ON")

        # Link Policies to Department
        for pol in policies:
            if department:
                self.graph_store.add_relationship(
                    pol, department.capitalize(), "APPLIES_TO"
                )

        # Link People to Technologies
        for person in found_people:
            for tech in found_techs:
                self.graph_store.add_relationship(person, tech, "USES")
