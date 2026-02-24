
from playwright.sync_api import sync_playwright
import time
import json

def verify_crash_fix():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Inject User
        user = {
            "id": "test-user",
            "name": "Test Student",
            "role": "STUDENT",
            "classLevel": "10",
            "board": "CBSE",
            "stream": "Science",
            "credits": 100,
            "isPremium": True
        }

        # Add init script to set localStorage before page loads
        # context.add_init_script(f"localStorage.setItem('nst_current_user', '{str(user).replace(chr(39), chr(34))}');")

        page = context.new_page()
        page.goto("http://localhost:5000")

        # Set LocalStorage and Reload
        user_json = json.dumps(user)
        page.evaluate(f"""() => {{
            localStorage.setItem('nst_current_user', '{user_json}');
            localStorage.setItem('nst_terms_accepted', 'true');
            localStorage.setItem('nst_has_seen_welcome', 'true');
        }}""")
        page.reload()

        # Wait for Dashboard
        try:
            page.wait_for_selector("text=My Courses", timeout=10000)
            print("Dashboard Loaded")
        except:
            print("Dashboard failed to load")
            page.screenshot(path="verification/dashboard_fail.png")
            return

        # Click My Courses
        page.click("text=My Courses")
        print("Clicked My Courses")

        # Wait for Subjects (mocked or static)
        # Subjects are loaded from constants usually
        try:
            page.wait_for_selector("text=Mathematics", timeout=5000) # Assuming Maths is there
            print("Subjects Loaded")
        except:
            print("Subjects failed to load")
            page.screenshot(path="verification/subjects_fail.png")
            return

        # Click Mathematics (This triggers handleContentSubjectSelect -> fetchChapters)
        # If my fix works, this should NOT crash and should load ChapterSelection
        page.click("text=Mathematics")
        print("Clicked Mathematics")

        # Wait for ChapterSelection
        try:
            page.wait_for_selector("text=Syllabus & Chapters", timeout=5000)
            print("Chapter Selection Loaded")
        except:
            print("Chapter Selection failed to load (or crashed)")
            page.screenshot(path="verification/chapter_fail.png")
            return

        # Take Screenshot
        page.screenshot(path="verification/verification.png")
        print("Verification Successful")

        browser.close()

if __name__ == "__main__":
    verify_crash_fix()
