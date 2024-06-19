const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authenticateJWT');

router.post('/register', userController.register);
router.get('/verify-email', userController.verifyEmail);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/get-username', authenticateJWT, userController.getUsername);
router.get('/profile/:username', userController.getProfile);
router.put('/profile', authenticateJWT, userController.updateProfile);
router.get('/', authenticateJWT, userController.getAllUsers);
router.put('/user/:id', authenticateJWT, userController.updateUser);
router.put('/:username/:status', authenticateJWT, userController.changeUserStatus);
router.delete('/:username', userController.deleteUser);
router.post('/add-address', userController.addAddress);
router.get('/:userId/address', userController.getAddress);
router.post('/change-password', authenticateJWT, userController.changePassword);
router.get('/get-stripe-account-id', authenticateJWT, userController.getStripeAccountId);

module.exports = router;
