#!/usr/bin/env python
from selenium import webdriver
from chromedriver_py import binary_path  # Đảm bảo rằng binary_path chỉ đến vị trí chính xác của chromedriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import os

# Hàm đăng nhập
def login(user, password):
    print('Starting the browser...')
    
    # Thiết lập các tùy chọn Chrome
    options = ChromeOptions()
    options.add_argument("--headless")  # Chạy Chrome ở chế độ headless
    options.add_argument("--no-sandbox")  # Vô hiệu hóa sandbox
    options.add_argument("--disable-dev-shm-usage")  # Vô hiệu hóa bộ nhớ chia sẻ
    options.add_argument("--disable-gpu")  # Tắt GPU (giúp chạy ổn định hơn trên môi trường headless)
    options.add_argument("--remote-debugging-port=9222")  # Cấu hình cổng cho remote debugging
    
    # Khởi tạo dịch vụ cho ChromeDriver
    service = Service(binary_path)
    driver = webdriver.Chrome(service=service, options=options)  # Truyền Service và các tùy chọn vào
    
    print('Browser started successfully. Navigating to the demo page to login.')
    driver.get('https://www.saucedemo.com/')
    
    # Thực hiện đăng nhập
    driver.find_element(By.ID, 'user-name').send_keys(user)
    driver.find_element(By.ID, 'password').send_keys(password)
    driver.find_element(By.ID, 'login-button').click()
    
    # Kiểm tra đăng nhập thành công
    assert "inventory.html" in driver.current_url
    print(f'Login successful with user: {user}')
    
    return driver

# Hàm thêm tất cả sản phẩm vào giỏ hàng
def add_all_products_to_cart(driver):
    print('Adding all products to cart...')
    add_to_cart_buttons = driver.find_elements(By.CLASS_NAME, 'btn_inventory')
    for button in add_to_cart_buttons:
        button.click()
    print(f'Added {len(add_to_cart_buttons)} products to cart.')  

# Hàm xóa tất cả sản phẩm khỏi giỏ hàng
def remove_all_products_from_cart(driver):
    print('Removing all products from cart...')
    remove_buttons = driver.find_elements(By.CLASS_NAME, 'btn_secondary')
    for button in remove_buttons:
        button.click()
    print(f'Removed {len(remove_buttons)} products from cart.')

# Hàm main để chạy các tác vụ chính
def main():
    # Đăng nhập
    driver = login('standard_user', 'secret_sauce')
    
    # Thêm và xóa sản phẩm khỏi giỏ hàng
    add_all_products_to_cart(driver)
    remove_all_products_from_cart(driver)
    
    # Đóng trình duyệt sau khi hoàn thành
    driver.quit()

if __name__ == "__main__":
    main()
