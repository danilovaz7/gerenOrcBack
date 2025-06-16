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
        nome: 'Aluno',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Professor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Diretor',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipo_usuarios', null);
  }
};
