'use strict'

/**
 * Resourceful controller for interacting with permissions
 */
class PermissionController {
  /**
   * Show a list of all permissions.
   * GET permissions
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new permission.
   * GET permissions/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new permission.
   * POST permissions
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single permission.
   * GET permissions/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing permission.
   * GET permissions/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update permission details.
   * PUT or PATCH permissions/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a permission with id.
   * DELETE permissions/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PermissionController
