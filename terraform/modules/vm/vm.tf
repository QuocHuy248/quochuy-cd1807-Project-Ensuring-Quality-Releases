resource "azurerm_network_interface" "vm_nic" {
  name                = "${var.vm_name}-nic"
  location            = var.location
  resource_group_name = var.resource_group

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = var.public_ip_address_id
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = var.vm_name
  location            = var.location
  resource_group_name = var.resource_group
  size                = "Standard_DS2_v2"
  admin_username      = "adminuser"
  network_interface_ids = [
    azurerm_network_interface.vm_nic.id
  ]
  admin_ssh_key {
    username   = "adminuser"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC74UJLaqrVXT0UwKdTcszWJYmNZGskfkZ0S9BLZgsV0neQFhIuuadWT6jDlv4wx6OZ+cWlyWkJWhfQrlD5lCdkffM+9KVNAuZcwA7JblQK4qjZEZiLf5Q8JTFZxCRWaFli0jY4jA0pfZm4Fvy4VWhuExHx5gt1q/pB2dsmeQCNeTVNE+GpAhdbCuAHOOokwl+NrYFBg419TmgIoY0dDdYH1zwDSA1y38w8fUIOuzwAmDtv4MZLjzeOamlHpYbJagbhMKQm1dHWEJnZEHz9YIsfXXyhOpAKwOeQOTAc4m1vBVVyWmEEfRXZ3ZCulryqHaWIaYXbL4PLUrznjvqnKRTzj2qLlpga93R38K1uxUWS5madXdwc5dep8jAtAfr8cWjfZIumBS6knLVu3KzgjchqhiztYKvVWIJRoMwSs1EvAvNczglZPHtjedrYFSjHfYl9/JpxGC5lW+CCS9pp+tyb2nd1Co9IVKqCX2q+wNqY7Uqw7A4VhjNICBCQ8yqbR9M= pc@LAPTOP-B1753BFL"
  }
  os_disk {
    caching           = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  source_image_id   = var.packer_image
  tags = {
    environment = "test"
}
}