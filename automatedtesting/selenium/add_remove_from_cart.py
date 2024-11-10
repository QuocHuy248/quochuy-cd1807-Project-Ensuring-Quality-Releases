#!/usr/bin/env python
from selenium import webdriver
from chromedriver_py import binary_path  # this will get you the path variable
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By  # Import the By class
from selenium.webdriver.chrome.service import Service  # Import Service
import os

# Start the browser and login with standard_user
def login(user, password):
    print('Starting the browser...')
    
    # Set up Chrome options
    options = ChromeOptions()
    options.add_argument("--headless")  # Run Chrome in headless mode
    options.add_argument("--no-sandbox")  # Add no-sandbox flag
    options.add_argument("--disable-dev-shm-usage")  # Disable dev shmem usage
    options.add_argument("--remote-debugging-port=9222")  # Add remote debugging port
    
    # Use Service instead of executable_path
    service = Service(executable_path=binary_path)  # Specify the path for chromedriver
    driver = webdriver.Chrome(service=service, options=options)  # Pass Service as argument
    
    print('Browser started successfully. Navigating to the demo page to login.')
    driver.get('https://www.saucedemo.com/')
    
    # Perform login
    driver.find_element(By.ID, 'user-name').send_keys(user)
    driver.find_element(By.ID, 'password').send_keys(password)
    driver.find_element(By.ID, 'login-button').click()
    
    # Verify login was successful
    assert "inventory.html" in driver.current_url
    print(f'Login successful with user: {user}')
    
    return driver

def add_all_products_to_cart(driver):
    print('Adding all products to cart...')
    add_to_cart_buttons = driver.find_elements(By.CLASS_NAME, 'btn_inventory')
    for button in add_to_cart_buttons:
        button.click()
    print(f'Added {len(add_to_cart_buttons)} products to cart.')  

def remove_all_products_from_cart(driver):
    print('Removing all products from cart...')
    remove_buttons = driver.find_elements(By.CLASS_NAME, 'btn_secondary')
    for button in remove_buttons:
        button.click()
    print(f'Removed {len(remove_buttons)} products from cart.')

def main():
    # Perform login
    driver = login('standard_user', 'secret_sauce')
    
    # Add and remove products from cart
    add_all_products_to_cart(driver)
    remove_all_products_from_cart(driver)
    
    # Quit the browser after tests
    driver.quit()

if __name__ == "__main__":
    main()
