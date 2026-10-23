"""
Execute Phase 1 Notebook using nbclient and save executed outputs.
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

nb_path = os.path.join(project_root, 'notebooks', 'phase1_data_audit_preprocessing.ipynb')
print(f"Loading notebook: {nb_path}")
nb = nbformat.read(nb_path, as_version=4)

print("Starting client execution...")
t0 = time.time()
client = NotebookClient(nb, timeout=600, kernel_name='python3', resources={'metadata': {'path': project_root}})
client.execute()
t1 = time.time()
print(f"Execution finished successfully in {t1 - t0:.2f} seconds!")

with open(nb_path, 'w', encoding='utf-8') as f:
    nbformat.write(nb, f)

print(f"Executed notebook saved with full outputs to: {nb_path}")
