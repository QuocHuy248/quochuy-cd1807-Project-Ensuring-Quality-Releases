provider "azurerm" {
  tenant_id       = var.tenant_id
  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  features {}
}

terraform {
  backend "azurerm" {
    storage_account_name = "tfstate2071127957"
    container_name       = "tfstate"
    key                  = "test.terraform.tfstate"
    access_key           = "ccWKjuQoN7hadNjRAj2+7kGTWF/az8Xy9bkU5jojA+v+14rTDtN6WdnY6MuZN553+bM/z05hdzpe+AStC5ZOmg=="
  }
}

module "resource_group" {
  source               = "../../modules/resource_group"
  resource_group       = "${var.resource_group}"
  location             = "${var.location}"
}
module "network" {
  source               = "../../modules/network"
  address_space        = var.address_space
  location             = var.location
  virtual_network_name = var.virtual_network_name
  application_type     = var.application_type
  resource_type        = "NET"
  resource_group       = module.resource_group.resource_group_name
  address_prefix_test  = var.address_prefix_test
}

module "nsg-test" {
  source              = "../../modules/networksecuritygroup"
  location            = var.location
  application_type    = var.application_type
  resource_type       = "NSG"
  resource_group      = module.resource_group.resource_group_name
  subnet_id           = module.network.subnet_id_test
  address_prefix_test = var.address_prefix_test
}

module "appservice" {
  source           = "../../modules/appservice"
  location         = var.location
  application_type = var.application_type
  resource_type    = "QuocHuyAppService"
  resource_group   = module.resource_group.resource_group_name
}

module "publicip" {
  source           = "../../modules/publicip"
  location         = var.location
  application_type = var.application_type
  resource_type    = "publicip"
  resource_group   = module.resource_group.resource_group_name
}
module "vm" {
  source                = "../../modules/vm"
  vm_name               = var.vm_name
  location              = var.location
  resource_group        = module.resource_group.resource_group_name
  virtual_network_name  = var.virtual_network_name
  subnet_id             = module.network.subnet_id_test
  public_ip_address_id  = module.publicip.public_ip_address_id
}
