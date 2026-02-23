from playwright.sync_api import sync_playwright
import time
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5001")

        # 1. Handle Terms
        try:
            page.get_by_role("button", name="I Agree & Continue").click(timeout=5000)
            print("Accepted Terms")
            time.sleep(1)
        except:
            print("Terms popup not found or already accepted")

        # 2. Inject User
        user = {
            "id": "test-user",
            "name": "Test User",
            "role": "STUDENT",
            "credits": 1000,
            "board": "CBSE",
            "classLevel": "10",
            "isPremium": True
        }

        page.evaluate(f"localStorage.setItem('nst_current_user', '{json.dumps(user)}');")
        print("Injected User")

        # 3. Reload to pick up user
        page.reload()
        time.sleep(5)

        # 4. Verify Dashboard
        page.screenshot(path="verification/dashboard.png")
        print("Dashboard Screenshot taken")

        # 5. Navigate to test (Mocking flow)
        # Assuming we land on Dashboard.
        # Need to simulate "Taking a Test".
        # Since actual content fetching might fail without valid keys or backend,
        # I will attempt to INJECT a Result directly into state or trigger the Marksheet.
        # But I can't easily access React state from outside.

        # Alternative: Try to click through if content is available.
        # If I can't, I will rely on the code review and static analysis, as mocking the whole backend flow in frontend test without mocks is hard.

        browser.close()

if __name__ == "__main__":
    run()
