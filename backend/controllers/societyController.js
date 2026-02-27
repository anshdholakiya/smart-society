const { Society } = require('../models');

// @desc    Get Society Details (Public/Resident)
exports.getSocietyDetails = async (req, res) => {
    try {
        // Assuming single society instance for now, or fetch first
        let society = await Society.findOne();
        if (!society) {
            // Create default if not exists
            society = await Society.create({ name: 'Smart Society' });
        }
        res.json(society);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching society details' });
    }
};

// @desc    Update Society Details (Admin Only)
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

        // Handle Gallery Images (Append new ones)
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            const currentGallery = society.gallery || [];
            society.gallery = [...currentGallery, ...newImages];
        }

        // Handle Gallery Removal (if indices passed)
        if (req.body.removeGalleryIndices) {
            const indicesToRemove = JSON.parse(req.body.removeGalleryIndices); // Expecting array of indices
            let currentGallery = society.gallery || [];
            // Filter out indices
            society.gallery = currentGallery.filter((_, index) => !indicesToRemove.includes(index));
        }

        await society.save();
        res.json(society);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating society details' });
    }
};
