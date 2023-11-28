import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Pagination } from '@mui/material';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import './App.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

axios.defaults.withCredentials = true;

function App() {
  const [data, setData] = useState([]);
  const [totalTodos, setTotalTodos] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://todo-37mc.onrender.com/todo/list?pageNumber=${
          page - 1
        }&limit=${limit}`
      );
      console.log(response.data.data.data);
      setData(response.data.data.data);
      setTotalTodos(response.data.data.totalTodos);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const generateStatus = (status) => {
    switch (status) {
      case '1':
        return 'open';
      case '2':
        return 'inprogress';
      case '3':
        return 'completed';
    }
  };
  const generateBadgeBg = (status) => {
    switch (status) {
      case '1':
        return '#6c6b6c';
      case '2':
        return '#b7ab11';
      case '3':
        return '#0d857a';
    }
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submitting data');
    let payload = {
      name: name,
      description: description,
      type: 'personal',
      status: status.toString(),
    };
    console.log(payload);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://todo-37mc.onrender.com/todo/create',
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        handleClose();
        setOpenAlert(true);
        setAlertMessage(response.data.message);
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Snackbar
        open={openAlert}
        autoHideDuration={30}
        message={alertMessage}
      />
      <div>
        <div className='title'>
          <h2>TODO </h2>
          <div className='todo-count'>{totalTodos}</div>
        </div>
        <div className='todo-list-container'>
          <div className='add-todo'>
            <Button
              variant='text'
              size='small'
              disableRipple='false'
              startIcon={<AddIcon />}
              onClick={handleOpen}
            >
              Add New Task
            </Button>
          </div>
          {data.map((item) => (
            <Accordion key={item._id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: '#9d9d9dde' }} />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography>{item.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className='description-container'>
                  <div className='description'>{item.description}</div>
                  <div
                    className='todo-badge'
                    style={{ background: generateBadgeBg(item.status) }}
                  >
                    {generateStatus(item.status)}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
        <Pagination
          count={Math.ceil(totalTodos / limit)}
          page={page}
          onChange={handlePageChange}
          variant='outlined'
          shape='rounded'
          size='medium'
        />

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style} className='form-container'>
            <Typography id='modal-modal-title' variant='h6' component='h3'>
              Add new Task
            </Typography>
            <form onSubmit={handleSubmit} className='form-container'>
              <TextField
                label='Name'
                size='small'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label='Description'
                size='small'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={status}
                label='Status'
                onChange={handleChange}
              >
                <MenuItem value={1}>Open</MenuItem>
                <MenuItem value={2}>Inprogress</MenuItem>
                <MenuItem value={3}>Completed</MenuItem>
              </Select>
              <Button
                variant='text'
                size='small'
                disableRipple='false'
                type='submit'
                disabled={name === '' || description === '' || status === ''}
              >
                Add New Task
              </Button>
            </form>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
}

export default App;
