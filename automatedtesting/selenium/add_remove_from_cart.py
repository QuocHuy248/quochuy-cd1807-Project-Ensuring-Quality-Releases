#!/usr/bin/env python
from selenium import webdriver
from chromedriver_py import binary_path # this will get you the path variable
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By  # Import the By class
import os

# Start the browser and login with standard_user
def login(user, password):
    print('Starting the browser...')
    
    options = ChromeOptions()
    options.add_argument("--headless")  # Run Chrome in headless mode
    
    driver = webdriver.Chrome(executable_path=binary_path, options=options)
    
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
    driver = login('standard_user', 'secret_sauce')
    
    add_all_products_to_cart(driver)
    remove_all_products_from_cart(driver)
    
    driver.quit()

if __name__ == "__main__":
    main()