from playwright.sync_api import sync_playwright
import time
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        # Capture console errors
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        print("Navigating to Dashboard...")
        try:
            page.goto("http://localhost:5003")
        except Exception as e:
            print(f"Navigation Failed: {e}")
            return

        # 1. Handle Terms
        try:
            page.get_by_role("button", name="I Agree & Continue").click(timeout=3000)
            print("Accepted Terms")
            time.sleep(1)
        except:
            pass

        # 2. Inject User
        user = {
            "id": "test-user-final",
            "name": "Final Verify User",
            "role": "STUDENT",
            "credits": 1000,
            "board": "CBSE",
            "classLevel": "10",
            "isPremium": True
        }
        page.evaluate(f"localStorage.setItem('nst_current_user', '{json.dumps(user)}');")
        print("Injected User")

        # 3. Reload
        try:
            page.reload()
            time.sleep(3)
        except Exception as e:
            print(f"Reload Failed: {e}")

        # 4. Check for Dashboard Element
        try:
            # Check for "Student App" header text or "My Courses"
            if page.get_by_text("Student App").count() > 0:
                print("SUCCESS: Dashboard Header Visible")
            else:
                print("FAILURE: Dashboard Header NOT Found")
                page.screenshot(path="debug_dashboard_fail.png")
        except Exception as e:
            print(f"Check Failed: {e}")

        browser.close()

if __name__ == "__main__":
    run()
