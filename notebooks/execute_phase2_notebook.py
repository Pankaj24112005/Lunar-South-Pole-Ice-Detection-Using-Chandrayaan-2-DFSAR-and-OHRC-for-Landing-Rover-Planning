"""
Execute Phase 2 Notebook using nbclient and save executed outputs.
"""

import sys
import os
import time
import asyncio
import nbformat
from nbclient import NotebookClient

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
os.chdir(project_root)

nb_path = os.path.join(project_root, 'notebooks', 'phase2_radar_polarimetry_ice_detection.ipynb')
print(f"Loading Phase 2 notebook: {nb_path}")
nb = nbformat.read(nb_path, as_version=4)

print("Starting client execution of Phase 2 notebook...")
t0 = time.time()
client = NotebookClient(nb, timeout=600, kernel_name='python3', resources={'metadata': {'path': project_root}})
client.execute()
t1 = time.time()
print(f"Phase 2 execution finished successfully in {t1 - t0:.2f} seconds!")

with open(nb_path, 'w', encoding='utf-8') as f:
    nbformat.write(nb, f)

print(f"Executed Phase 2 notebook saved with full outputs to: {nb_path}")
