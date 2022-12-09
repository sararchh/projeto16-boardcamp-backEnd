import * as Yup from 'yup';

const customersSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  phone: Yup.string().min(10).max(11).required('Telefone é obrigatório'),
  cpf: Yup.string().min(11).max(11).required('CPF obrigatório'),
  birthday: Yup.date('dd/MM/yyyy').required('Aniversário obrigatório')
});

export default customersSchema;