provider "azurerm" {
  tenant_id       = var.tenant_id
  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  features {}
}

terraform {
  backend "azurerm" {
    storage_account_name = "tfstate588516480"
    container_name       = "tfstate"
    key                  = "test.terraform.tfstate"
    access_key           = "Ui88jxZHMv0ZNXj5a8MHK1h/JVGhw861W3Nq1t0QUQYokav91AlVe8XqT7WdniAHJL9uWMqZm//9+AStR5Nsbg=="
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
