from playwright.sync_api import sync_playwright
import time
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. Login as Admin
        admin_user = {
            "id": "admin_1",
            "name": "Super Admin",
            "role": "ADMIN",
            "credits": 9999,
            "isPremium": True,
            "subscriptionTier": "LIFETIME",
            "mcqHistory": [],
            "dailyRoutine": {
                "date": "Test Date",
                "focusArea": "Test Focus",
                "tasks": []
            }
        }

        # Go to app
        try:
            page.goto("http://localhost:5001", timeout=60000)
        except:
            print("Timeout loading page. Server might be slow.")
            return

        # Inject LocalStorage
        user_json = json.dumps(admin_user)
        page.evaluate(f"localStorage.setItem('nst_current_user', '{user_json}');")
        page.reload()

        page.wait_for_timeout(5000)

        # 2. Check for Admin Switch Button (bottom right)
        print("Looking for Admin Panel button...")
        try:
            # It's a button with text "Admin Panel"
            btn = page.get_by_text("Admin Panel")
            if btn.is_visible():
                btn.click()
                print("Clicked Admin Panel")
                page.wait_for_timeout(3000)
            else:
                print("Admin Panel button not visible. Check role.")
        except Exception as e:
            print(f"Error finding Admin button: {e}")

        # 3. Check Watermark Settings (Visibility Tab)
        print("Checking Watermark Tab...")
        try:
            # Click Visibility Tab
            page.get_by_text("Visibility & Watermark").click()
            page.wait_for_timeout(1000)
            page.screenshot(path="verification_admin_watermark.png")
            print("Screenshot taken: verification_admin_watermark.png")
        except Exception as e:
            print(f"Failed to verify Admin Watermark: {e}")
            page.screenshot(path="verification_error_admin.png")

        # 4. Check Student Dashboard Routine
        print("Checking Student Routine...")
        try:
            # Exit Admin
            page.get_by_text("Exit").click()
            page.wait_for_timeout(3000)

            # Scroll to Routine
            # It might be down the page.
            routine_header = page.get_by_text("Daily Routine AI")
            if routine_header.is_visible():
                routine_header.scroll_into_view_if_needed()
                page.wait_for_timeout(1000)
                page.screenshot(path="verification_student_routine.png")
                print("Screenshot taken: verification_student_routine.png")
            else:
                print("Routine header not found on Student Dashboard.")
                page.screenshot(path="verification_error_student.png")
        except Exception as e:
            print(f"Failed to verify Student Routine: {e}")

        browser.close()

if __name__ == "__main__":
    run()
