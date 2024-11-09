
variable "vm_name" {
  description = "The name of the Virtual Machine"
  type        = string
}

variable "location" {
  description = "The location where the VM will be created"
  type        = string
}

variable "resource_group" {
  description = "The name of the resource group in which the VM will be created"
  type        = string
}

variable "virtual_network_name" {
  description = "The virtual network name"
  type        = string
}

variable "subnet_id" {
  description = "The ID of the subnet"
  type        = string
}

variable "public_ip_address_id" {
  description = "The ID of the public IP address"
  type        = string
}
