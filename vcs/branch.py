# branch.py
# This might need to interact with commits, for example, to create a branch at a specific commit
from .commit import create_commit

def create_branch(name, start_point='master', repo_name='.yourvcs'):
    """Create a new branch."""
    ...


# branch.py
def create_branch(name, start_point='master', repo_name='.yourvcs'):
    """Create a new branch."""
    # Copy the start_point commit hash to the new branch file in refs/heads
    pass

