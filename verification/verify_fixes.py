import os

def check_file_content(filepath, search_strings):
    if not os.path.exists(filepath):
        print(f"FAIL: {filepath} not found")
        return False

    with open(filepath, 'r') as f:
        content = f.read()

    all_found = True
    for s in search_strings:
        if s not in content:
            print(f"FAIL: '{s}' not found in {filepath}")
            all_found = False

    if all_found:
        print(f"PASS: All strings found in {filepath}")
    return all_found

def main():
    # 1. Check RevisionHub for handleGenerateAiPlan
    check_file_content('components/RevisionHub.tsx', [
        'const handleGenerateAiPlan = () => {'
    ])

    # 2. Check FeatureAccessPage for configMode logic
    check_file_content('components/admin/FeatureAccessPage.tsx', [
        "const [configMode, setConfigMode] = useState<'STUDENT' | 'SUB_ADMIN'>('STUDENT');",
        "if (configMode === 'STUDENT' && f.adminVisible) return false;",
        "if (configMode === 'SUB_ADMIN' && !f.adminVisible) return false;",
        "adminVisible: f.adminVisible"
    ])

if __name__ == "__main__":
    main()
