'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipo_usuarios', [
      {
        nome: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Cliente',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipo_usuarios', null);
  }
};
