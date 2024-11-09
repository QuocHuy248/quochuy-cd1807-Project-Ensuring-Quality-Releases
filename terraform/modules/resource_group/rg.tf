# Reference the existing resource group
data "azurerm_resource_group" "test" {
  name = var.resource_group
}