var db = require('./../helpers/db_helpers')
var helper = require('./../helpers/helpers')
var multiparty = require('multiparty')
var fs = require('fs');
var imageSavePath = "./public/img/"
var image_base_url = helper.ImagePath();

const msg_success = "successfully";
const msg_fail = "fail";

module.exports.controller = (app, io, socket_list) => {


    const msg_invalidUser = "Please check your username and password";
    const msg_already_register = "this email already register ";

    const msg_product_added = "Cloth added Successfully.";
    const msg_product_update = "Cloth updated Successfully.";
    const msg_product_delete = "Cloth deleted Successfully.";

    const msg_already_added = "this value already added here";
    const msg_added = "already added here";





    function getProductDetail(res, prod_id) {
        db.query("SELECT `pd`.`prod_id`, `pd`.`cat_id`, `pd`.`brand_id`, `pd`.`type_id`, `pd`.`name`, `pd`.`detail`, `pd`.`unit_name`, `pd`.`unit_value`,  `pd`.`price`, `pd`.`created_date`, `pd`.`modify_date`, `cd`.`cat_name`, IFNULL( `bd`.`brand_name`, '' ) AS `brand_name` , `td`.`type_name` FROM `product_detail` AS  `pd` " +
            "INNER JOIN `category_detail` AS `cd` ON `pd`.`cat_id` = `cd`.`cat_id` " +
            "LEFT JOIN `brand_detail` AS `bd` ON `pd`.`brand_id` = `bd`.`brand_id` " +
            "INNER JOIN `type_detail` AS `td` ON `pd`.`type_id` = `td`.`type_id` " +
            " WHERE `pd`.`status` = ? AND `pd`.`prod_id` = ? ; " +
            
            
            "SELECT `img_id`, `prod_id`, `image` FROM `image_detail` WHERE `prod_id` = ? AND `status` = ? ", [



            "1", prod_id, prod_id, "1", prod_id, "1",

        ], (err, result) => {

            if (err) {
                helper.ThrowHtmlError(err, res);
                return;
            }

            // result = result.replace_null()

            // helper.Dlog(result);
            
            if(result[0].length > 0) {

                result[0][0].nutrition_list = result[1];
                result[0][0].images = result[2];


                res.json({  
                    "status": "1", "payload": result[0][0]
                });
            }else{
                res.json({ "status": "0", "message": "invalid item" })
            }

            

        })
    }

    app.post('/api/admin/offer_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            db.query("SELECT `offer_id`, `prod_id`, `price`, `start_date`, `end_date`, `status`, `created_date`, `modify_date` FROM `offer_detail` WHERE `status`= ? ", [
                "1"
            ], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return;
                }

                res.json({
                    "status": "1", "payload": result
                });
            })
        }, "2")
    })

    app.post('/api/admin/promo_code_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (userObj) => {
                db.query("SELECT `promo_code_id`, `code`, `title`, `description`, `type`, `min_order_amount`, `max_discount_amount`, `offer_price`, `start_date`, `end_date`, `created_date`, `modify_date` FROM `promo_code_detail` WHERE `status` = 1 ORDER BY `promo_code_id` DESC ", [], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    res.json({
                        'status': '1',
                        'payload': result,
                        'message': msg_success
                    })
                })
        }, "2")
    })

    app.post('/api/admin/new_orders_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (userObj) => {
            db.query("SELECT `od`.`order_id`,`od`.`user_id`, `od`.`cart_id`, `od`.`total_price`, `od`.`user_pay_price`, `od`.`discount_price`, `od`.`deliver_price`, `od`.`deliver_type`, `od`.`payment_type`, `od`.`payment_status`, `od`.`order_status`, `od`.`status`, `od`.`created_date`, GROUP_CONCAT(DISTINCT `pd`.`name` SEPARATOR ',') AS `names`, GROUP_CONCAT(DISTINCT (CASE WHEN `imd`.`image` != '' THEN  CONCAT( '" + image_base_url + "' ,'', `imd`.`image` ) ELSE '' END) SEPARATOR ',') AS `images`  FROM `order_detail` AS `od` " +
                "INNER JOIN `cart_detail` AS `cd` ON FIND_IN_SET(`cd`.`cart_id`, `od`.`cart_id`) > 0  " +
                "INNER JOIN `product_detail` AS `pd` ON  `cd`.`prod_id` = `pd`.`prod_id` " +
                "INNER JOIN `image_detail` AS `imd` ON  `imd`.`prod_id` = `pd`.`prod_id` " +
                "WHERE (`od`.`payment_type` = 1 OR ( `od`.`payment_type` = 2 AND `od`.`payment_status` = 2 ) ) AND `order_status` <= 2 GROUP BY `od`.`order_id` ORDER BY `od`.`order_id` ", [], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    res.json({
                        "status": "1",
                        "payload": result,
                        "message": msg_success
                    })
                })
        },'2')
    })

    app.post('/api/admin/completed_orders_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (userObj) => {
            db.query("SELECT `od`.`order_id`, `od`.`user_id`, `od`.`cart_id`, `od`.`total_price`, `od`.`user_pay_price`, `od`.`discount_price`, `od`.`deliver_price`, `od`.`deliver_type`, `od`.`payment_type`, `od`.`payment_status`, `od`.`order_status`, `od`.`status`, `od`.`created_date`, GROUP_CONCAT(DISTINCT `pd`.`name` SEPARATOR ',') AS `names`, GROUP_CONCAT(DISTINCT (CASE WHEN `imd`.`image` != '' THEN  CONCAT( '" + image_base_url + "' ,'', `imd`.`image` ) ELSE '' END) SEPARATOR ',') AS `images`  FROM `order_detail` AS `od` " +
                "INNER JOIN `cart_detail` AS `cd` ON FIND_IN_SET(`cd`.`cart_id`, `od`.`cart_id`) > 0  " +
                "INNER JOIN `product_detail` AS `pd` ON  `cd`.`prod_id` = `pd`.`prod_id` " +
                "INNER JOIN `image_detail` AS `imd` ON  `imd`.`prod_id` = `pd`.`prod_id` " +
                "WHERE (`od`.`payment_type` = 1 OR ( `od`.`payment_type` = 2 AND `od`.`payment_status` = 2 ) ) AND `order_status` = 3 GROUP BY `od`.`order_id` ORDER BY `od`.`order_id` ", [], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    res.json({
                        "status": "1",
                        "payload": result,
                        "message": msg_success
                    })
                })
        }, '2')
    })

    app.post('/api/admin/cancel_decline_orders_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (userObj) => {
            db.query("SELECT `od`.`order_id`, `od`.`user_id`, `od`.`cart_id`, `od`.`total_price`, `od`.`user_pay_price`, `od`.`discount_price`, `od`.`deliver_price`, `od`.`deliver_type`, `od`.`payment_type`, `od`.`payment_status`, `od`.`order_status`, `od`.`status`, `od`.`created_date`, GROUP_CONCAT(DISTINCT `pd`.`name` SEPARATOR ',') AS `names`, GROUP_CONCAT(DISTINCT (CASE WHEN `imd`.`image` != '' THEN  CONCAT( '" + image_base_url + "' ,'', `imd`.`image` ) ELSE '' END) SEPARATOR ',') AS `images`  FROM `order_detail` AS `od` " +
                "INNER JOIN `cart_detail` AS `cd` ON FIND_IN_SET(`cd`.`cart_id`, `od`.`cart_id`) > 0  " +
                "INNER JOIN `product_detail` AS `pd` ON  `cd`.`prod_id` = `pd`.`prod_id` " +
                "INNER JOIN `image_detail` AS `imd` ON  `imd`.`prod_id` = `pd`.`prod_id` " +
                "WHERE (`od`.`payment_type` = 1 OR ( `od`.`payment_type` = 2 AND `od`.`payment_status` = 2 ) ) AND `order_status` > 3  GROUP BY `od`.`order_id` ORDER BY `od`.`order_id` ", [], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    res.json({
                        "status": "1",
                        "payload": result,
                        "message": msg_success
                    })
                })
        }, '2')
    })

    app.post('/api/admin/order_detail', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (userObj) => {
            helper.CheckParameterValid(res, reqObj, ["order_id", "user_id"], () => {


                db.query("SELECT `od`.`order_id`, `od`.`cart_id`, `od`.`total_price`, `od`.`user_pay_price`, `od`.`discount_price`, `od`.`deliver_price`, `od`.`deliver_type`, `od`.`payment_type`, `od`.`payment_status`, `od`.`order_status`, `od`.`status`, `od`.`created_date` FROM `order_detail` AS `od` " +

                    "WHERE `od`.`order_id` = ? AND `od`.`user_id` = ? ;" +

                    "SELECT `uod`.`order_id`, `ucd`.`cart_id`, `ucd`.`user_id`, `ucd`.`prod_id`, `ucd`.`qty`, `pd`.`cat_id`, `pd`.`brand_id`, `pd`.`type_id`, `pd`.`name`, `pd`.`detail`, `pd`.`unit_name`, `pd`.`unit_value`,  `pd`.`price`, `pd`.`created_date`, `pd`.`modify_date`, `cd`.`cat_name`, IFNULL( `bd`.`brand_name`, '' ) AS `brand_name` , `td`.`type_name`, IFNULL(`od`.`price`, `pd`.`price` ) as `offer_price`, IFNULL(`od`.`start_date`,'') as `start_date`, IFNULL(`od`.`end_date`,'') as `end_date`, (CASE WHEN `od`.`offer_id` IS NOT NULL THEN 1 ELSE 0 END) AS `is_offer_active`, (CASE WHEN `imd`.`image` != '' THEN  CONCAT( '" + image_base_url + "' ,'', `imd`.`image` ) ELSE '' END) AS `image`, (CASE WHEN `od`.`price` IS NULL THEN `pd`.`price` ELSE `od`.`price` END) as `item_price`, ( (CASE WHEN `od`.`price` IS NULL THEN `pd`.`price` ELSE `od`.`price` END) * `ucd`.`qty`)  AS `total_price` FROM `order_detail` AS `uod` " +
                    "INNER JOIN `cart_detail` AS `ucd` ON FIND_IN_SET(`ucd`.`cart_id`, `uod`.`cart_id`) > 0  " +
                    "INNER JOIN `product_detail` AS `pd` ON `pd`.`prod_id` = `ucd`.`prod_id` AND `pd`.`status` = 1  " +
                    "INNER JOIN `category_detail` AS `cd` ON `pd`.`cat_id` = `cd`.`cat_id` " +
                    
                    "LEFT JOIN `brand_detail` AS `bd` ON `pd`.`brand_id` = `bd`.`brand_id` " +
                    "LEFT JOIN `offer_detail` AS `od` ON `pd`.`prod_id` = `od`.`prod_id` AND `od`.`status` = 1 AND `od`.`start_date` <= NOW() AND `od`.`end_date` >= NOW() " +
                    "INNER JOIN `image_detail` AS `imd` ON `pd`.`prod_id` = `imd`.`prod_id` AND `imd`.`status` = 1 " +
                    "INNER JOIN `type_detail` AS `td` ON `pd`.`type_id` = `td`.`type_id` " +
                    "WHERE `uod`.`order_id` = ? AND `uod`.`user_id` = ? GROUP BY `ucd`.`cart_id`, `pd`.`prod_id`", [reqObj.order_id, reqObj.user_id, reqObj.order_id, reqObj.user_id], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res)
                            return
                        }

                        if (result[0].length > 0) {

                            result[0][0].cart_list = result[1]

                            res.json({
                                "status": "1",
                                "payload": result[0][0],
                                "message": msg_success
                            })
                        } else {
                            res.json({
                                'status': '0',
                                'message': 'invalid order'
                            })
                        }
                })
            })
        },'2')
    })

    app.post('/api/admin/order_status_change', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (userObj) => {
            helper.CheckParameterValid(res, reqObj, ["order_id", "user_id", "order_status"], () => {
                db.query("UPDATE `order_detail` SET `order_status`= ?,`modify_date`= NOW() WHERE `order_id` = ? AND `user_id` = ? AND `order_status` < ? ", [reqObj.order_status, reqObj.order_id, reqObj.user_id, reqObj.order_status] , (err, result) => {
                    if(err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if(result.affectedRows > 0) {

                        var title = ""
                        var message = ""
                        var notiType = 2
                        //1: new, 2: order_accept, 3: order_delivered, 4: cancel, 5: order declined	
                        switch (reqObj.order_status) {
                            case "2":
                                title = "Order Accepted"
                                message = "your order #" + reqObj.order_id +" accepted."
                                break;
                            case "3":
                                title = "Order Delivered"
                                message = "your order #" + reqObj.order_id + " delivered."
                                break;
                            case "4":
                                title = "Order Cancel"
                                message = "your order #" + reqObj.order_id + " canceled."
                                break;
                            case "5":
                                title = "Order Declined"
                                message = "your order #" + reqObj.order_id + " declined."
                                break;
                            default:
                                break;
                        }

                        db.query("INSERT INTO `notification_detail`( `ref_id`, `user_id`, `title`, `message`, `notification_type`) VALUES (?,?,?, ?,?)", [reqObj.order_id, reqObj.user_id, title, message, notiType  ] , (err, iResult) => {
                            if (err) {
                                helper.ThrowHtmlError(err);
                                return
                            }

                            if (iResult) {
                                helper.Dlog("Notification Added Done")
                            }else{
                                helper.Dlog("Notification Fail")
                            }
                        } )

                        res.json({
                            "status":"1",
                            "message": "Order Status updated successfully"
                        })
                    }else{
                        res.json({
                            "status": "0",
                            "message": msg_fail
                        })
                    }
                } )
            } )
        },'2')
    } )


}

function checkAccessToken(headerObj, res, callback, require_type = "") {
    helper.Dlog(headerObj.access_token);
    helper.CheckParameterValid(res, headerObj, ["access_token"], () => {
        db.query("SELECT `user_id`, `username`, `user_type`, `name`, `email`, `mobile`, `mobile_code`,  `auth_token`, `dervice_token`, `status` FROM `user_detail` WHERE `auth_token` = ? AND `status` = ? ", [headerObj.access_token, "1"], (err, result) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return
            }

            helper.Dlog(result);

            if (result.length > 0) {
                if (require_type != "") {
                    if (require_type == result[0].user_type) {
                        return callback(result[0]);
                    } else {
                        res.json({ "status": "0", "code": "404", "message": "Access denied. Unauthorized user access." })
                    }
                } else {
                    return callback(result[0]);
                }
            } else {
                res.json({ "status": "0", "code": "404", "message": "Access denied. Unauthorized user access." })
            }
        })
    })
}