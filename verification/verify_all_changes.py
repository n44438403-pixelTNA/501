import os

def check_content(filepath, search_strings):
    if not os.path.exists(filepath):
        print(f"FAILED: {filepath} not found")
        return False

    with open(filepath, 'r') as f:
        content = f.read()

    all_found = True
    for s in search_strings:
        if s not in content:
            print(f"FAILED: '{s}' not found in {filepath}")
            all_found = False

    if all_found:
        print(f"SUCCESS: {filepath} verified")
    return all_found

def main():
    checks = {
        'components/RevisionHub.tsx': [
            "completedYesterday",
            "Yesterday's Report"
        ],
        'components/StudentDashboard.tsx': [
            "checkFeatureAccess('START_STUDY'",
            "checkFeatureAccess('MY_ANALYSIS'",
            "checkFeatureAccess('VIDEO_ACCESS'",
            "isLocked && <div className=\"absolute top-2 right-2 bg-red-500"
        ],
        'components/admin/FeatureAccessPage.tsx': [
            "const [configMode, setConfigMode] = useState<'STUDENT' | 'SUB_ADMIN'>('STUDENT');",
            "onClick={() => setConfigMode('STUDENT')}",
            "onClick={() => setConfigMode('SUB_ADMIN')}",
            "{configMode === 'STUDENT' ? ("
        ]
    }

    success = True
    for filepath, strings in checks.items():
        if not check_content(filepath, strings):
            success = False

    if success:
        print("\nALL CHECKS PASSED")
    else:
        print("\nSOME CHECKS FAILED")
        exit(1)

if __name__ == "__main__":
    main()
