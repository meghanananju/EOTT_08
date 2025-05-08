/*
 *************************************************************************************************************
 * License Information :Alten Global Technology Solutions Private Limited.                  	               *
 *                      #37, Krishna Reddy Colony, Domlur layout,            				                         *
 *                      Domlur,Bangalore - 560071, INDIA                    				                         *
 *                      Licensed software and All rights reserved.           		                             *
 *************************************************************************************************************
 * File             : profile.js									                                                             *
 *													                                                                                 *
 * Description      :  To get profile of  the user 	                               *
 *													                                                                                 *
 * Author(s)        :Meghana N							                                                               *					    					                                                                                       *
 * Version History:											                                                                     *
 * <Version Number>                 <Author>              <date>      <defect Number>      <Modification	   *
 *                                                                                          made and the     *
 *                                                                                          reason for	     *
 *                                                                                          modification >   *
 *  1.0                			 Meghana N	            22.04.2025        --               initial version	     *
 *													                                                                                 *
 * References        : None.								                                                                 *
 *                     											                                                                 *
 * Assumption(s)     : None.										                                                             *
 *                     										                                                                   *
 * Constraint(s)     : None.										                                                             *
 *                     											                                                                 *
 *************************************************************************************************************
 */
// Importing the necessary module
const { StatusCodes } = require("http-status-codes");
const { logger } = require("../../logs/logger");
const asyncWrapper = require("../../middleware/async");
const { profileService } = require("../../services/profileService");
const { configurations } = require("../../config/config");

// Exported function for handling profile endpoint
exports.profile = asyncWrapper(async (req, res) => {
    logger.info(configurations.logger.profileLogger);

    const { userName } = req.body;
    const result = await profileService(userName);
    res.status(StatusCodes.OK).json(result);
});
