const Store = require('../models/store')
const Category = require('../models/categories.model')

exports.updateProfile = async (req, res) => {
  try {
    var {
      store_id,
      name,
      store_name,
      street_address,
      category,
      state,
      zip,
      city,
      country,
      phone,
      watsapp,
      founded,
      slogan,
      website_url
    } = req.body
    var bannerImage
    if (req.files.length > 0) {
      bannerImage = req.files[0].path
    }
    if (!store_id) {
      return res.status(200).json({ msg: 'Enter store_id', status: false })
    } else {
      var categories = await Category.find({ category: category })
      if (categories.length == 0) {
        return res.status(200).json({ msg: 'Enter valid category', status: false })
      } else {
        var storedb = await Store.findById(store_id)

        await Store.updateOne({ _id: store_id }, {
          name: name || storedb.name,
          store_name: store_name,
          street_address: street_address,
          category: category,
          state: state,
          zip: zip,
          city: city,
          country: country,
          phone: phone,
          watsapp: watsapp,
          founded: founded,
          slogan: slogan,
          website_url: website_url,
          banner_image: bannerImage
        }).then(data => {
          res.status(200).json({ msg: 'Store profile updated', status: true })
        })
      }
    }
  } catch (err) {
    return res.status(200).json({ msg: 'Error occured, ' + err, status: false })
  }
}

exports.getStoreProfile = async (req, res) => {
  try {
    var store_id = req.params.store_id
    var profile = await Store.find(
      { _id: store_id },
      { otp: 0, createdAt: 0, updatedAt: 0, __v: 0, password: 0}
    )
    if (!profile) {
      res.status(200).json({ msg: 'Store not found', status: false })
    } else {
      res.status(200).json({ msg: 'Store data', data: profile, status: true })
    }
  } catch (err) {
    return res.status(200).json({ msg: 'Error occured, ' + err, status: false })
  }
}

exports.addCategory = async (req, res) => {
  try {
    var { category } = req.body
    var categories = await Category.find({ category: category }, { _id: 0 })
    if (!category) {
      return res.status(200).json({ msg: 'Enter category name', status: false })
    } else {
      if (categories.length > 0) {
        return res
          .status(200)
          .json({ msg: 'Category already available', status: false })
      } else {
        var categorydata = new Category({
          category: category
        })
        await categorydata.save()
        res.status(200).json({ msg: 'Category added', status: true })
      }
    }
  } catch (err) {
    return res.status(200).json({ msg: 'Error occured, ' + err, status: false })
  }
}

exports.categoriesList = async (req, res) => {
  try {
    var categories = await Category.find({}, { category: 1 })
    if (categories.length > 0) {
      res
        .status(200)
        .json({ msg: 'categories list', status: true, data: categories })
    } else {
      res.status(200).json({
        msg: 'No categories available',
        status: true,
        data: categories
      })
    }
  } catch (err) {
    return res.status(200).json({ msg: 'Error occured, ' + err, status: false })
  }
}

exports.saveFeed = async (req, res) => {
  try {
    var { store_id, feedtext } = req.body
    if (!store_id) {
      return res.status(200).json({ msg: 'Enter store_id', status: false })
    } else {
      var feedPhoto
      if (req.files.length > 0) {
        feedPhoto = req.files[0].path
      }
      var json = {
        feedPhoto: feedPhoto,
        feedtext: feedtext
      }
      await Store.updateOne({ _id: store_id }, { $push: { gallery: json } })
      res.status(200).json({ msg: 'Feed uploaded', status: true })
    }
  } catch (err) {
    return res.status(200).json({ msg: 'Error occured, ' + err, status: false })
  }
}

exports.getStoreGallery = async (req, res) => {
  try {
    var store_id = req.params.store_id
    var storeGallery = await Store.findById(store_id)
    if (!storeGallery) {
      res.status(200).json({ msg: 'Store not found', status: false })
    } else {
      res.status(200).json({ msg: 'Store gallery', data: storeGallery.gallery, status: true })
    }
  } catch (err) {
    return res.status(200).json({ msg: 'Error occured, ' + err, status: false })
  }
}
