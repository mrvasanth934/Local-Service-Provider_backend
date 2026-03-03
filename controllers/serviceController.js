const serviceModel = require("../models/serviceModel");

const { failiureResposne, successResposne, errorResponse } = require("../utils/response");

const createService = async (req, res) => {
    try {
        const provider = req.user
        const { serviceName, serviceCategory, serviceDescription, servicePrice, providerExperince } = req.body;
        if (!serviceName) {
            return failiureResposne(res, "serviceName is required")
        }
        if (!serviceCategory) {
            return failiureResposne(res, "serviceCategory is required")
        }
        if (!servicePrice) {
            return failiureResposne(res, "servicePrice is required")
        }
        if (!serviceDescription) {
            return failiureResposne(res, "serviceDescription is required")
        }
        if (!providerExperince) {
            return failiureResposne(res, "providerExperince is required")
        }
        if (Number(providerExperince) <= 1) {
            return failiureResposne(res, "providerExperience must greater than or equal 1 year")
        }
        const createService = await serviceModel.create({ serviceName, serviceCategory, serviceDescription, servicePrice, providerExperince, provider: provider._id })
        if (!createService) {
            return failiureResposne(res, "can`t create service")
        }
        return successResposne(res, "sevice created successfull", createService)
    } catch (error) {
        errorResponse(res, "error from create service", error.message)
    }
}

const getAllServices = async (req, res) => {
    try {
        const allServices = await serviceModel.find()
        if (allServices) {
            if (allServices.length == 0) {
                return successResposne(res, "no more services")
            }
            return successResposne(res, "get all services", allServices)
        }
        return failiureResposne(res, "can`t get all services")
    } catch (error) {
        errorResponse(res, "error from getAllServices service", error.message)
    }
}

const getServiceBydId = async (req, res) => {
    try {
        const { serviceId } = req.body;
        if (serviceId.length != 24) {
            return failiureResposne(res, "inValid serviceId")
        }
        const service = await serviceModel.findOne({ _id: serviceId })
        if (!service) {
            return failiureResposne(res, "can`t find service")
        }
        return successResposne(res, "service finded", service)
    } catch (error) {
        errorResponse(res, "error from getServiceById", error.message)
    }
}

const updateServicePrice = async(req,res) =>{
    const provider = req.user
    try {
        const {providerExperince} = req.body;
        const { serviceId } = req.body;
        if (serviceId.length != 24) {
            return failiureResposne(res, "inValid serviceId")
        }
        const isExist = await serviceModel.findOne({_id:serviceId,provider:provider._id})
        let servicePrice;
        if(Number(providerExperince) == 0.5 ){
            servicePrice =  servicePrice + servicePrice % 15
        }
        if(Number(providerExperince) == 1 ){
            servicePrice =  servicePrice + servicePrice % 30
        }
        if(!isExist){
            return failiureResposne(res,"can`t get service")
        }
        const updateService = await serviceModel.updateOne({_id:serviceId},{providerExperince, servicePrice})
        if(!updateService){
            return failiureResposne(res,"can`t update service")
        }
        return successResposne(res,"your service is updated")

    } catch (error) {

    }
}

const updateServiceRequest = async () => {
    try {
        const { serviceId, status } = req.params
        if (serviceId.length != 24) {
            return failiureResposne(res, "inValid seriveId")
        }
        if (status == true) {
            const udpdateService = await serviceModel.updateOne({ _id: serviceId }, { isVerified: true, isVerifiedRequest: false })
            if (!udpdateUser) {
                return failiureResposne(res, "can`t update service Request")
            }
            return successResposne(res, "service request updated")
        }
        const udpdateService = await serviceModel.updateOne({ _id: serviceId }, { isVerifiedRequest: false })
        if (!udpdateUser) {
            return failiureResposne(res, "can`t update service Request")
        }
        return successResposne(res, "service request updated")
    } catch (error) {
        return errorResponse(res, "error from updateServiceRequest", error.message)
    }
}

const gatServicesRequests = async (req, res) => {
    try {
        const requestedServices = await serviceModel.find({ isVerifiedRequest: true })
        if (requestedServices) {
            if (requestedServices.length == 0) {
                return successResposne(res, "no more services requests")
            }
            return successResposne(res, "services requests", requestedServices)
        }
        return failiureResposne(res, "cant get services requests")
    } catch (error) {
        return errorResponse(res, "error from getServicesRequest", error.message)
    }
}

const deleteService = async () => {
    try {
        const { serviceId } = req.params;
        if (serviceId.length != 24) {
            return failiureResposne(res, "inValid seriveId")
        }
        const deleteService = await serviceModel.deleteOne({ _id: serviceId })
        if (!deleteService) {
            return failiureResposne(res, "can`t delete the service")
        }
        return successResposne(res, "service deleted")
    } catch (error) {
        return errorResponse(res, "error from delete service", error.message)
    }
}

const getServicesByCategory = async () => {
    try {
        const { category } = req.body
        if (!category) {
            return failiureResposne(res, "category is required")
        }
        const services = await serviceModel.find({ category: { $regex: searchTerm, $options: 'i' } })
        if (services) {
            if (services.length == 0) {
                return successResposne(res, "no more results by the category")
            }
            return successResposne(res, "services", services)
        }
        return failiureResposne(res, "can`t get services")
    } catch (error) {
        return errorResponse(res, "error from getServices by category service", error.message)
    }
}

const getProviderServices = async () =>{
    const {providerId} = req.params
    if(providerId.length != 24){
        return failiureResposne(res,"inValid providerId")
    }
    const services = await serviceModel.find({provider:providerId})
    if(services){
        if(services.length == 0){
            return successResposne(res,"no more services by the provider")
        }
        return successResposne(res,"services",services)
    }
    return failiureResposne(res,"can`t get services")
}

module.exports = {createService}