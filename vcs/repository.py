import os

def init_repository(repo_name='.yourvcs'):
    """Initialize a new repository."""
    os.makedirs(repo_name, exist_ok=True)
    subdirs = ['objects', 'refs/heads']
    for subdir in subdirs:
        os.makedirs(os.path.join(repo_name, subdir), exist_ok=True)
    with open(os.path.join(repo_name, 'HEAD'), 'w') as f:
        f.write('refs/heads/master\n')

# Example usage:
init_repository()

