const fs = require('fs');
const path = require('path');
const request = require('request');
const async = require("async");
const cloudinary = require('cloudinary').v2;

const saveImagesToLocal = async (jsonData) => {
    let succeededUploads = 0;
    let failedUploads = [];

    let q = async.queue(function(target, cb) {
        request
        .get(target.image_url)
        .on('response', function(response) {
            console.log("Saving to local: " + target.img_id);
            console.log(target.image_url + ' : ' + response.statusCode, response.headers['content-type']);
            console.log(target.local_destination);
            cb();
        })
        .on('error', function(err) {
            console.log(err);
            cb(err);
        })
        .pipe(fs.createWriteStream(target.local_destination))
        .on("finish", async () => {
            console.log("Cloud success: " + succeededUploads);
            console.log("Cloud failures: " + failedUploads.length);
            console.log("Uploading to cloud: " + target.img_id + " to: " + target.cloud_destination);
            try {
                await cloudinary.uploader.upload((target.local_destination), {
                    use_filename: true,
                    folder: target.cloud_destination
                });
                succeededUploads += 1;
            } catch (error) {
                failedUploads.push({
                    file: fileNames[i],
                    error
                });
                console.log(error);
            }  
        });
    }, 1);

    q.drain = function() {
        console.log('Async queue draining done')
    };

    for (let i = 0; i < jsonData.length; i++) {
        console.log(jsonData[i].card_images);
        const cardImages = jsonData[i].card_images;
        cardImages.forEach(image => {
            const {
                id: img_id,
                image_url: image_url_large,
                image_url_small
            } = image;
            const targetSmall = {
                img_id,
                image_url: image_url_small,
                local_destination:  path.join(__dirname, '..', 'public', 'card-images', 'small-images' , img_id+'.jpg'),
                cloud_destination: "iygo-cards-small"
            }
            const targetLarge= {
                img_id,
                image_url: image_url_large,
                local_destination:  path.join(__dirname, '..', 'public', 'card-images', 'large-images' , img_id+'.jpg'),
                cloud_destination: "iygo-cards-large"
            }
            q.push([targetSmall, targetLarge], function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
};

module.exports = {
    saveImagesToLocal
};