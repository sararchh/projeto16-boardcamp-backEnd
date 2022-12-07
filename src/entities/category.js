import * as Yup from 'yup';

const categorySchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
});

export default categorySchema;
