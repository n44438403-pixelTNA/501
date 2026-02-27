
from playwright.sync_api import sync_playwright
import time

def verify_student_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (assuming default Vite port)
        page.goto("http://localhost:5002")

        # Wait for potential loading
        time.sleep(5)

        # Take a screenshot of the initial load state (Login or Dashboard)
        page.screenshot(path="verification/dashboard_final_check_2.png")

        # If we see login, we might need to bypass or check for elements
        content = page.content()
        if "Login" in content or "Dashboard" in content or "Sign Up" in content:
            print("Page loaded successfully with content.")
        else:
            print("Page might be blank/white screen.")

        browser.close()

if __name__ == "__main__":
    verify_student_dashboard()
