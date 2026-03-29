const { Society } = require('../models');
const { cloudinary } = require('../middleware/uploadMiddleware');

const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('/upload/')) return null;
    let path = url.split('/upload/')[1]; 
    if (path.match(/^v\d+\//)) {
        path = path.substring(path.indexOf('/') + 1); 
    }
    const lastDotIndex = path.lastIndexOf('.');
    return lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;
};

exports.getSocietyDetails = async (req, res) => {
    try {
        
        let society = await Society.findOne();
        if (!society) {
            
            society = await Society.create({ name: 'Smart Society' });
        }
        res.json(society);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching society details' });
    }
};

exports.updateSocietyDetails = async (req, res) => {
    try {
        let society = await Society.findOne();
        if (!society) {
            society = await Society.create({});
        }

        society.name = req.body.name || society.name;
        society.address = req.body.address || society.address;
        society.contactNumber = req.body.contactNumber || society.contactNumber;
        if (req.body.amenities) {
            society.amenities = typeof req.body.amenities === 'string' ? JSON.parse(req.body.amenities) : req.body.amenities;
        }
        if (req.body.wings) {
            society.wings = typeof req.body.wings === 'string' ? JSON.parse(req.body.wings) : req.body.wings;
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            const currentGallery = society.gallery || [];
            society.gallery = [...currentGallery, ...newImages];
        }

        if (req.body.removeGalleryIndices) {
            const indicesToRemove = JSON.parse(req.body.removeGalleryIndices); 
            let currentGallery = society.gallery || [];

            for (let index of indicesToRemove) {
                if (currentGallery[index]) {
                    const publicId = getPublicIdFromUrl(currentGallery[index]);
                    if (publicId) {
                        try {
                            await cloudinary.uploader.destroy(publicId);
                            console.log(`Deleted Cloudinary image: ${publicId}`);
                        } catch (err) {
                            console.error(`Failed to delete Cloudinary image: ${publicId}`, err);
                        }
                    }
                }
            }

            society.gallery = currentGallery.filter((_, index) => !indicesToRemove.includes(index));
        }

        await society.save();
        res.json(society);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating society details' });
    }
};
