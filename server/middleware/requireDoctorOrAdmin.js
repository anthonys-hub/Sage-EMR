const requireDoctorOrAdmin = (req, res, next) => {
    if (!(req.user.role === 'admin' || req.user.role === 'doctor')) {
        return res.status(401).json({ message: 'Unauthorized' })



    }
    next()
}

module.exports = requireDoctorOrAdmin