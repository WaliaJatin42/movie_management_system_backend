/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and login APIs
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: jatin_super
 *               password:
 *                 type: string
 *                 example: Walia@123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *       400:
 *         description: Invalid credentials or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 */


/**
 * @swagger
 * /api/v1/users/create_user:
 *   post:
 *     summary: Create a new user (admin/superadmin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *               - first_name
 *               - last_name
 *               - phone_number
 *             properties:
 *               username:
 *                 type: string
 *                 example: new_admin
 *               email:
 *                 type: string
 *                 example: newadmin@example.com
 *               password:
 *                 type: string
 *                 example: Admin@1234
 *               role:
 *                 type: string
 *                 enum: [user, admin, superadmin]
 *                 example: admin
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               phone_number:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - insufficient permissions
 *       400:
 *         description: Bad Request - user exists or validation error
 */

