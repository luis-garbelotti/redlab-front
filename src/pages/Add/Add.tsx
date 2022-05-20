import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAlert from '../../hooks/useAlert';
import { AxiosError } from 'axios';
import { createNewClient, createNewProject } from '../../services/api';
import AddButton from '../../components/AddComponents/AddButton';
import Header from '../../components/Header/Header';
import NavBar from '../../components/Navbar/Navbar';
import PageContainer from '../../components/PageContainer/PageContainer';
import PageContent from '../../components/PageContent/PageContent';
import ProjectResume from '../../components/ProjectResume/ProjectResume';
import ResumeContainer from '../../components/ResumeContainer/ResumeContainer';
import AddText from '../../components/AddComponents/AddText';
import AddInput from '../../components/AddComponents/AddInput';
import AddSubmitButton from '../../components/AddComponents/AddSubmitButton';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

const styles = {
  container: {
    overflow: 'auto',
    height: '70vh',
    width: '100%',
    paddingRight: '10%',
    pl: '5px'
  },
  dateContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  clientContainer: {
    display: 'flex',
    alignItems: 'center',
    height: 'auto'
  },
  clientSelect: {
    bgcolor: '#343434',
    height: '5vh',
    borderRadius: '5px',
    mb: '10px',
    color: '#fff'
  },
};

export interface ProjectData {
  title: string;
  resume: string;
  importantInfos: string;
  startDate: string;
  limitDate: string;
  clientId: number;
}

export interface ClientData {
  name: string;
  email: string;
  phone: string;
}

type TabValue = 'Projeto' | 'Cliente';

export default function AddProject() {

  const { auth } = useAuth();
  const { setMessage } = useAlert();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState<TabValue>('Projeto');
  const [client, setClient] = useState('');
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    resume: '',
    importantInfos: '',
    startDate: '',
    limitDate: '',
    clientId: 0,
  });
  const [clientData, setCLientData] = useState<ClientData>({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!auth || !auth.token) {
      navigate('/');
    }
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setTabValue(newValue);
  };

  const handleClientChange = (event: SelectChangeEvent) => {
    setClient(event.target.value as string);
    setProjectData({ ...projectData, clientId: parseInt(event.target.value) });
  };

  function handleClientInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCLientData({ ...clientData, [e.target.name]: e.target.value });
  }

  async function handleProjectSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!auth.token) {
      return;
    }

    const { title, resume, importantInfos, startDate, limitDate, clientId } = projectData;

    if (!title || !resume || !importantInfos || !startDate || !limitDate || !clientId) {
      setMessage({ type: 'warning', text: 'Preencha todos os campos.' });
    }

    try {
      await createNewProject(projectData, auth.token);
      setMessage({ type: 'success', text: 'Projeto cadastrado com sucesso!' });

    } catch (error: AxiosError | Error | any) {
      setMessage({ type: 'error', text: 'Algo deu errado. Tente novamente!' });
    }

  }

  async function handleClientSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!auth.token) {
      return;
    }

    const { name, email, phone } = clientData;

    if (!name || !email || !phone) {
      setMessage({ type: 'warning', text: 'Preencha todos os campos.' });
    }

    try {
      await createNewClient(clientData, auth.token);
      setMessage({ type: 'success', text: 'Projeto cadastrado com sucesso!' });

    } catch (error: AxiosError | Error | any) {
      setMessage({ type: 'error', text: 'Algo deu errado. Tente novamente!' });
    }
  }

  return (
    <PageContainer >
      <NavBar />
      <PageContent >
        <Header>
          Cadastrar
        </Header>

        <Box sx={{ width: '100%' }}>
          <TabContext value={tabValue}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="primary"
            >
              <Tab value="Projeto" label="Projeto" />
              <Tab value="Cliente" label="Cliente" />
            </Tabs>

            <TabPanel value='Projeto'>
              <Box component='div' sx={styles.container}>
                <AddText>
                  Título
                </AddText>
                <AddInput
                  name="title"
                  value={projectData.title}
                  onChange={handleInputChange}
                  type='text'
                />
                <AddText>
                  Resumo
                </AddText>
                <AddInput
                  name="resume"
                  value={projectData.resume}
                  onChange={handleInputChange}
                  type='text'
                />
                <AddText>
                  Informações importantes
                </AddText>
                <AddInput
                  name="importantInfos"
                  value={projectData.importantInfos}
                  onChange={handleInputChange}
                  type='text'
                />
                <Box component='div' sx={styles.dateContainer} >
                  <Box component='div' >
                    <AddText>
                      Data início
                    </AddText>
                    <AddInput
                      name="startDate"
                      value={projectData.startDate}
                      onChange={handleInputChange}
                      type='date'
                    />
                  </Box>

                  <Box component='div' >
                    <AddText>
                      Data Entrega
                    </AddText>
                    <AddInput
                      name="limitDate"
                      value={projectData.limitDate}
                      onChange={handleInputChange}
                      type='date'
                    />
                  </Box>
                </Box>
                <br />
                <Box sx={styles.clientContainer}>
                  <AddText>
                    Cliente
                  </AddText>
                  <FormControl fullWidth>
                    <InputLabel id="client-select-label"></InputLabel>
                    <Select
                      labelId="client-select"
                      id="client-select"
                      value={client}
                      label="client"
                      name="clientId"
                      onChange={handleClientChange}
                      sx={styles.clientSelect}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>t</MenuItem>
                      <MenuItem value={30}>Ten</MenuItem>
                      <MenuItem value={40}>Ten</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <AddSubmitButton onClick={handleProjectSubmit} />
              </Box>
            </TabPanel>
            <TabPanel value='Cliente' >
              <Box component='div' sx={styles.container}>
                <AddText>
                  Nome
                </AddText>
                <AddInput
                  name="name"
                  value={clientData.name}
                  onChange={handleClientInputChange}
                  type='text'
                />
                <AddText>
                  email
                </AddText>
                <AddInput
                  name="email"
                  value={clientData.email}
                  onChange={handleClientInputChange}
                  type='email'
                />
                <AddText>
                  Telefone
                </AddText>
                <AddInput
                  name="phone"
                  value={clientData.phone}
                  onChange={handleClientInputChange}
                  type='text'
                />
                <AddSubmitButton onClick={handleClientSubmit} />
              </Box>
            </TabPanel>
          </TabContext>
        </Box>

      </PageContent>
      <ResumeContainer>
        <ProjectResume />
        <AddButton />
      </ResumeContainer>
    </PageContainer>
  );
}