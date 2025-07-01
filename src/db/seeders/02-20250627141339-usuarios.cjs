'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const usuarios = [
      {
        nome: 'Camila Leutz',
        email: 'doc@gmail.com',
        senha: '123',
        cpf: '778568635',
        rg: '135263636',
        id_tipo_usuario: 1,
        dt_nascimento: new Date(),
        estado_civil: 'solteiro',
        sexo: 'fem',
        endereco: 'Rua amarela',
        num_endereco: '22',
        complemento: 'casa 2',
        cidade: 'Santos',
        bairro: 'Macuco',
        cep: '11030560',
        naturalidade: 'Brasi',
        nacionalidade: 'Brasileira',
        raca: 'branca',
        filhos: 2,
        telefone: '32325467',
        celular: '998817246',
        profissao: 'Médica',
        local_trabalho: 'Rua vermelha, 12',
        instagram: 'doc_camila',
        facebook: 'Camila Leutz',
        ic_ativo: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]

    for (let usuario of usuarios) {
      const hashedPassword = await bcrypt.hash(usuario.senha, 10);
      usuario.senha = hashedPassword;
    }

    await queryInterface.bulkInsert('usuarios', usuarios);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null);
  }
};
