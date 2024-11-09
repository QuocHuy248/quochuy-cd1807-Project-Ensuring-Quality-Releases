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
    public_key = file("ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDCCMJ3YRTJPMEVCDNmtXl4i3xvdNFZLdfHVmeFbVOBSlO4rKY7XzTEGejguHqmk3cZwCx2GfzGSgdhIEDTOxblgtDi1Z05iGdRmbziQdr8cq8J6OOaIYVd08ZEixaOV3Z49kfSygpELBQlxaX37FAR23fUbbpMt0BW8tcQdYBGg5aHobh7Y+SEkQuFqG4H9byDK7LjghwFyremB2fHvpC70zVoHaEKBacmWzBYOVzAgPZeuSe30XCOrfDAb4Bz0pu3m7HaeJtv64F4PQQQWozlNR5Ch3Drwdr5YRUjxeI4kuTTgKwoctcK1QRQHy50kiXvv1knYcPI3gFG0SCaUwrSn5uNxMub2U+66RbpzEDu+qYfjbmArrHjUeX9b0NnPYMY9Tb3a7v3jFEcyAtNGUqhSeXnlPVDOT+hZ2QVoNH/WOWoVdU4q1oR/gLhDV5+/PAbRwC1/nVdt4A/5ymqs+Ek+QPKCRKi6KN0EaeA5PfLdCceJYxaDNIUAamMLarPdOc= pc@LAPTOP-B1753BFL")
  }
  os_disk {
    caching           = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}
