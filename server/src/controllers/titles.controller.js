import { fetchUPCData } from "../services/upcService.js"
import { lightCleanTitle, extractFormat } from "../services/upcService.js";
import { insertTitle } from "../services/upcService.js";



//POST /api/titles

export const createTitle = async (req, res) => {
   

    try {
            
    //gather upc from scanner

    const { upc } = req.body

    //normalize upc
    const normalizedUPC = String(upc || "").trim()

    if(!normalizedUPC) {
        res.status(400).json({
            message: "UPC is required to add title to the vault"
        })
    }

    //call upc service

    const upcResult = await fetchUPCData(normalizedUPC)

    if(!upcResult) {
        return res.status(404).json({
            message: "No product found for that UPC"
        })
    }

    //get raw title

    const rawTitle = upcResult.title;

    if(!rawTitle) {
        return res.status(404).json({
            message: " UPC result did not include a title"
        })
    }


    //clean + normalize

    const cleanedTitle = lightCleanTitle(rawTitle)
    const format = extractFormat(rawTitle)

    if (!cleanedTitle){
        return res.status(422).json({
            message: "Could not generate a usable title from UPC results",
            rawTitle,
        })
    }

    // save to database

    const newTitle = await insertTitle({
        title: cleanedTitle, 
        raw_upc_title: rawTitle,
        barcode: normalizedUPC, 
        format, 
        metadata_status: "basic", 
        rip_status: "not_ripped"
    })

    return res.status(201).json({
        message: "Title added successfull", 
        title: newTitle
    })
    } catch (error) {
        console.error("createTitle error:", error)
        return res.status(500).json({
            message: "Failed to add title to the vault",
            error: error.messages
        })
    }





}