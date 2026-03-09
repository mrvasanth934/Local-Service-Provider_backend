const serviceModel = require("../models/serviceModel");
const userModel = require("../models/userModel");

const { failiureResposne, successResposne, errorResponse } = require("../utils/response");

const createService = async (req, res) => {
    try {
        const provider = req.user
        const { serviceName, serviceCategory, serviceDescription, servicePrice, providerExperince } = req.body;
        if (!serviceCategory) {
            return failiureResposne(res, "Choose a serviceCategory")
        }
        if (!serviceName) {
            return failiureResposne(res, "choose a serviceName")
        }
        if (!providerExperince) {
            return failiureResposne(res, "providerExperince is required")
        }
        if (Number(providerExperince) < 1) {
            return failiureResposne(res, "providerExperience must greater than or equal 1 year")
        }
        if (!servicePrice) {
            return failiureResposne(res, "servicePrice is required")
        }
        if (!serviceDescription) {
            return failiureResposne(res, "serviceDescription is required")
        }
        if(serviceDescription.split(" ").length < 30){
            return failiureResposne(res, `description min 30 words , this contain ${serviceDescription.split(" ").length} words`)
        }
        if(serviceDescription.split(" ").length > 40){
            return failiureResposne(res, `description upto 40 words , this contain ${serviceDescription.split(" ").length} words`)
        }
        
        const createService = await serviceModel.create({ serviceName, serviceCategory, serviceDescription, servicePrice, providerExperince, provider: provider._id })
        if (!createService) {
            return failiureResposne(res, "can`t create service")
        }
        const updateProvider = await userModel.updateOne({ _id: provider._id }, { $push: { services: createService._id } })
        if (updateProvider) {
            return successResposne(res, "sevice created successfull", createService)
        }
        return failiureResposne(res, "service created , user services not updated")
    } catch (error) {
        errorResponse(res, "error from create service", error.message)
    }
}

const getServicesRequests = async (req, res) => {
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

const updateServiceRequest = async (req, res) => {
    try {
        const { serviceId, status } = req.params
        if (serviceId.length != 24) {
            return failiureResposne(res, "inValid seriveId")
        }
        const isExist = await serviceModel.findOne({ _id: serviceId })
        if (!isExist) {
            return failiureResposne(res, "can`t find the service")
        }
        if (isExist.isVerified) {
            return failiureResposne(res, "this service is already verified")
        }
        if (!isExist.isVerifiedRequest) {
            return failiureResposne(res, "no verify request from the service")
        }
        if (status == "true") {
            const udpdateService = await serviceModel.updateOne({ _id: serviceId }, { isVerified: true, isVerifiedRequest: false })
            if (!udpdateService) {
                return failiureResposne(res, "can`t update service Request")
            }
            return successResposne(res, "service request updated")
        }
        await userModel.updateOne({ _id: isExist.provider }, { $pull: { services: serviceId } })
        const deleteService = await serviceModel.deleteOne({ _id: serviceId })
        if (!deleteService) {
            return failiureResposne(res, "can`t update service Request")
        }
        return successResposne(res, "service deleted")
    } catch (error) {
        return errorResponse(res, "error from updateServiceRequest", error.message)
    }
}

const getAllServices = async (req, res) => {
    try {
        const allServices = await serviceModel.find({ isVerified: true }).populate("provider")
        if (allServices) {
            if (allServices.length == 0) {
                return successResposne(res, "no more services")
            }
            return successResposne(res, "get all services", allServices)
        }
        return failiureResposne(res, "can`t get all services")
    } catch (error) {
        errorResponse(res, "error from getAllServices", error.message)
    }
}

const getServiceBydId = async (req, res) => {
    try {
        const { serviceId } = req.params;
        if (serviceId.length != 24) {
            return failiureResposne(res, "inValid serviceId")
        }
        const service = await serviceModel.findOne({ _id: serviceId, isVerified: true }).populate("provider")
        if (!service) {
            return failiureResposne(res, "can`t find service")
        }
        return successResposne(res, "service finded", service)
    } catch (error) {
        errorResponse(res, "error from getServiceById", error.message)
    }
}

const updateServicePrice = async (req, res) => {
    try {
        const { serviceId } = req.params
        const { providerExperince } = req.body
        if (serviceId.length != 24) {
            return failiureResposne(res, "inValid serviceId")
        }
        const provider = req.user
        const isExist = await serviceModel.findOne({ _id: serviceId, provider: provider._id, isVerified: true })
        if (!isExist) {
            return failiureResposne(res, "can`t get service")
        }

        let servicePrice;
        let addedExperience
        if (providerExperince == 0.5) {
            servicePrice = (isExist.servicePrice / 10) + isExist.servicePrice
        }
        if (providerExperince == 1) {
            servicePrice = (isExist.servicePrice / 5) + isExist.servicePrice
        }
        addedExperience = isExist.providerExperince + providerExperince
        const updateService = await serviceModel.updateOne({ _id: serviceId }, { providerExperince: addedExperience, servicePrice })
        if (!updateService) {
            return failiureResposne(res, "can`t update service")
        }
        return successResposne(res, "your service is updated")

    } catch (error) {
        return errorResponse(res, "error from update service price", error.message)
    }
}

const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        if (serviceId.length != 24) {
            return failiureResposne(res, "inValid seriveId")
        }
        const isExist = await serviceModel.findOne({ _id: serviceId })
        if (isExist) {
            await userModel.updateOne({ _id: isExist.provider , isVerified:true }, { $pull: { services: serviceId } })
            const deleteService = await serviceModel.deleteOne({ _id: serviceId })
            if (!deleteService) {
                return failiureResposne(res, "can`t delete the service")
            }
            return successResposne(res, "service deleted")
        }
        return failiureResposne(res, "can`t find service")
    } catch (error) {
        return errorResponse(res, "error from delete service", error.message)
    }
}

const getServicesByCategory = async (req, res) => {
    try {
        const { category } = req.params
        const services = await serviceModel.find({ serviceCategory: { $regex: category, $options: 'i' } ,isVerified:true})
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

const serchServices = async (req, res) => {
    try {
        const { serchKeywords } = req.params
        const services = await serviceModel.find({
            $or: [
                { serviceName: { $regex: serchKeywords, $options: "i" } },
                { serviceCategory: { $regex: serchKeywords, $options: "i" } },
                { serviceDescription: { $regex: serchKeywords, $options: "i" } }
            ],
            isVerified:true
        })
        if (services) {
            if (services.length == 0) {
                return successResposne(res, "no more results by the serch")
            }
            return successResposne(res, "services", services)
        }
        return failiureResposne(res, "can`t get services")
    } catch (error) {
        return errorResponse(res, "error from serch services", error.message)
    }
}

const getProviderServices = async (req, res) => {
    const provider = req.user
    const services = await serviceModel.find({ provider: provider._id })
    if (services) {
        if (services.length == 0) {
            return successResposne(res, "no more services by the provider")
        }
        return successResposne(res, "services", services)
    }
    return failiureResposne(res, "can`t get services")
}

module.exports = { createService, getAllServices, getServiceBydId, getServicesRequests, updateServiceRequest, updateServicePrice, getServicesByCategory, deleteService,serchServices,getProviderServices }