const router = require("express").Router();

let upload = require('../controllers/multer.config')
const {
    register,
    login,
    sendMailOtp,
    verifyOtp,
    changePassword,

} = require('../controllers/auth.controller')

const {
    updateProfile,
    addCategory,
    categoriesList,
    saveFeed,
    getStoreProfile,
    getStoreGallery
} = require('../controllers/storeProfile.controller')

const {
    userRegister,
    userLogin,
    sendUserMailOtp,
    verifyUserOtp,
    changeUserPassword,
    searchStoreByCategory,
    searchStore
} = require('../controllers/users.controller')

const { feedUpload, bannerPicUpload } = require('../controllers/multer.config');

router.post('/register', register)
router.post('/login', login)
router.post('/sendMailOtp', sendMailOtp)
router.post('/verifyOtp', verifyOtp)
router.post('/changePassword', changePassword)

router.post('/updateStoreProfile', bannerPicUpload.any("bannerImage"), updateProfile)
router.post('/addCategory', addCategory)
router.get('/categoriesList', categoriesList)

router.post("/saveFeed", feedUpload.any("feedPhoto"), saveFeed);

router.get("/getStoreProfile/:store_id", getStoreProfile)
router.get("/getStoreGallery/:store_id", getStoreGallery)

//app users 

router.post('/userRegister', userRegister)
router.post('/userLogin',userLogin)
router.post('/sendUserMailOtp',sendUserMailOtp)
router.post('/verifyUserOtp',verifyUserOtp)
router.post('/changeUserPassword',changeUserPassword)
router.get('/searchStoreByCategory/:category',searchStoreByCategory)
router.get('/searchStore/:searchKey',searchStore)

module.exports = router;