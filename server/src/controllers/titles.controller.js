import { fetchUPCData } from "../services/upcService.js"
import { lightCleanTitle, extractFormat } from "../services/upcService.js";
import { insertTitle } from "../services/upcService.js";
import { pool } from "../config/db.js";


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

//GET /api/titles

export const getAllTitles = async (req, res) => {

    pool.query(
        'SELECT * FROM titles ORDER BY id ASC',
    (error, results) => {
        if(error){
            throw error
        }

        res.status(200).json(results.rows)
    })



}

// GET /api/titles/:id

export const getTitleById = async (req, res) => {

    const  { upc } = req.params

    pool.query('SELECT * FROM titles WHERE barcode = $1', [upc], (error, results) => {
        if(error) {
            throw error
        }

       if (results.rows.length === 0) {
            return res.status(404).json({
            message: `No title found with UPC ${upc}`
        })
      }
        res.status(200).json(results.rows)
    })

}


// PATCH /api/titles/:id

export const patchTitle = async (req, res) => {

    const { upc } = req.params

    const {title, media_type, release_year, format, notes, rip_status, poster_url } = req.body

   const updatedTitle =  pool.query(
        `UPDATE titles 
         SET title = $1,  
             release_year = $2, 
             format = $3, 
             notes = $4, 
             rip_status = $5, 
             poster_url = $6
             WHERE barcode = $7
             RETURNING *` ,          
        [title, release_year, format, notes, rip_status, poster_url, upc],
        (error, results) => {
            if(error) {
                throw error
            }

            if (results.rows.length === 0){
                return res.status(404).json({
                    message: `No title found with UPC ${upc}`
                })
            }
            res.status(200).json({
                message: `Title ${updatedTitle} updated.`,
                updatedTitle: results.rows[0]
            })
        }
    )


}

//DELETE /api/titles/:id

export const deleteTitle = async (req, res) => {

    const { upc } = req.params

    pool.query(
        "DELETE FROM titles WHERE barcode = $1 RETURNING *",
        [upc],
        (error, results) => {

            if (error) {
                throw error
            }

            if (results.rows.length === 0) {
                return res.status(404).json({
                    message: `No title found with UPC ${upc}`
                })
            }

            res.status(200).json({
                message: `Title deleted with UPC: ${upc}`,
                deletedTitle: results.rows[0]
            })
        }
    )
}