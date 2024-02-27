# content.py
import hashlib
import os
from .repository import init_repository  # Assuming init_repository might be used for additional setup tasks


def hash_content(content):
    """Generate a SHA-1 hash for the given content."""
    sha1 = hashlib.sha1()
    sha1.update(content.encode('utf-8'))
    return sha1.hexdigest()

def store_object(content, repo_name='.yourvcs'):
    """Store a content object in the repository."""
    hash_id = hash_content(content)
    subdir = hash_id[:2]
    filename = hash_id[2:]
    object_path = os.path.join(repo_name, 'objects', subdir)
    os.makedirs(object_path, exist_ok=True)
    with open(os.path.join(object_path, filename), 'w') as f:
        f.write(content)
    return hash_id

