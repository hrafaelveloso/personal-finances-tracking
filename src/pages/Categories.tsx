import React, { useState, useMemo, useCallback } from 'react';
import useCategories from '../utils/swr-hooks/useCategories';
import {
  makeStyles,
  Grid,
  Typography,
  Input,
  InputAdornment,
  IconButton,
  TextField,
  Button,
} from '@material-ui/core';
import { Edit, Close, Save } from '@material-ui/icons';
import { ICategory } from '../interfaces';
import isEmpty from '../utils/isEmpty';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';
import HeaderLabelButton from '../components/HeaderLabelButton';

const useStyles = makeStyles(
  () => ({
    main: {
      marginTop: '50px',
    },
    new: {
      marginTop: '20px',
      marginBottom: '10px',
    },
    input: {
      marginBottom: '15px',
      padding: '10px 0px',
    },
    icon: {
      marginLeft: '10px',
    },
    button: {
      height: '100%',
      width: '100%',
    },
  }),
  { name: 'Categories' }
);

const Category: React.FC<CategoryProps> = React.memo(({ category, saveEdit }) => {
  const { name } = category;
  const [value, setValue] = useState(name);
  const [editing, setEditing] = useState(false);
  const classes = useStyles();

  return (
    <Input
      className={classes.input}
      fullWidth
      disabled={!editing}
      value={editing ? value : name}
      onChange={e => setValue(e.target.value)}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            onClick={e => {
              e.preventDefault();
              setEditing(old => !old);
            }}
          >
            {editing ? <Close /> : <Edit />}
          </IconButton>
          {editing && (
            <IconButton
              className={classes.icon}
              onClick={e => {
                e.preventDefault();
                saveEdit({ ...category, name: value });
                setEditing(false);
              }}
            >
              <Save />
            </IconButton>
          )}
        </InputAdornment>
      }
    />
  );
});

interface CategoryProps {
  category: ICategory;
  saveEdit: (info: ICategory) => void;
}

const Categories: React.FC = () => {
  const classes = useStyles();
  const { categories, isLoading, mutate } = useCategories();
  const [search, setSearch] = useState('');
  const [newCat, setNewCat] = useState('');
  const [error, setError] = useState('');

  const showCategories = useMemo(() => {
    if (isEmpty(search)) {
      return categories;
    }

    return categories.filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  const saveEdit = useCallback(
    async (info: ICategory) => {
      try {
        setError('');
        mutate(
          categories.map(item => (item._id === info._id ? { ...item, name: info.name } : item)),
          false
        );

        await axios.put('/categories', info);
      } catch (err) {
        if (err?.response?.data?.message) {
          setError(err?.response?.data?.message);
        }
        mutate();
      }
    },
    [categories, mutate]
  );

  const newCategory = useCallback(
    async newName => {
      setNewCat('');

      try {
        setError('');
        mutate([{ _id: Math.random(), name: newName }, ...categories], false);

        await axios.post('/categories', { name: newName });
      } catch (err) {
        if (err?.response?.data?.message) {
          setError(err?.response?.data?.message);
        }
        mutate();
      }
    },
    [mutate, categories]
  );

  return (
    <>
      <HeaderLabelButton label="Categorias" spacing={4} />
      <Grid container justify="center" spacing={4} className={classes.main}>
        <Grid item xs={10} md={6} lg={3}>
          <TextField
            fullWidth
            label="Filtrar categorias"
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container justify="center" spacing={4} className={classes.new}>
        <Grid item xs={10} lg={3}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adicionar nova categoria"
                variant="filled"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    newCategory(newCat);
                  }
                }}
              />
            </Grid>
            <Grid item>
              <Button
                endIcon={<Save />}
                onClick={e => {
                  e.preventDefault();
                  newCategory(newCat);
                }}
                className={classes.button}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {!isEmpty(error) && <ErrorMessage message={error} />}
      <Grid container justify="center" spacing={4}>
        <Grid item xs={10} md={6} lg={3}>
          {isLoading ? (
            <Typography variant="h6">A carregar resultados...</Typography>
          ) : (
            showCategories.map(category => (
              <Category key={category._id} category={category} saveEdit={saveEdit} />
            ))
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Categories;
