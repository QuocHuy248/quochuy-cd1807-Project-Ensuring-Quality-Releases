# Azure GUIDs
variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
}

variable "client_id" {
  description = "Client ID (Application ID) from the Azure Active Directory"
  type        = string
}

variable "client_secret" {
  description = "Client secret for authentication"
  type        = string
  sensitive   = true
}

variable "tenant_id" {
  description = "Azure Active Directory tenant ID"
  type        = string
}

# Resource Group/Location
variable "location" {
  description = "Azure location for resources"
  type        = string
}

variable "resource_group" {
  description = "Resource group name"
  type        = string
}

variable "application_type" {
  description = "Type of application"
  type        = string
}

# Network
variable "virtual_network_name" {
  description = "Name of the virtual network"
  type        = string
}

variable "address_prefix_test" {
  description = "Address prefix for the testing subnet"
  type        = string
}

variable "address_space" {
  description = "Address space for the virtual network"
  type        = list(string)
}

variable "vm_name" {
  description = "The name of the Virtual Machine"
  type        = string
}

variable "access_key" {
  type        = string
}