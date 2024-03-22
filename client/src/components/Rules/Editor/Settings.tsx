import { ActionIcon, Box, Grid, Group, Select, TextInput, Text, Switch, Textarea, Modal, Divider } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconCode, IconGripVertical, IconKey, IconPlus, IconSettings, IconTable, IconTag, IconTrash } from "@tabler/icons-react";
import SelectConnector from "../../Common/SelectConnector";
import { useContext, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import SchemaContext from "../../../providers/SchemaContext";
import ExplorerContext from "../../../providers/ExplorerContext";
import providers from "../../../modules/connectors";

const logLevels = [
    { value: '0', label: 'Disabled' },
    { value: '1', label: 'Per-execution timestamp' },
    { value: '2', label: 'Per-execution summary' },
    { value: '3', label: 'Per-action summary' },
];

interface Secondary {
    primary: string;
    secondaryKey: string;
    primaryKey: string;
}

function Config( { opened, close, form  }: { opened?: string, close: ()=>void, form: UseFormReturnType<Rule> } ) {
    const { _connectors } = useContext(SchemaContext);
    const provider = opened ? providers[_connectors[opened].id] : undefined;
    const primary = form.values.primary === opened;
    return (
        <Modal opened={!!opened} onClose={close} size="auto" title={<Group gap="xs" >{provider&&<provider.icon size={18} />}{`Configure ${opened} connector`}</Group>}>
            {provider&&<>{!primary&&<>
            <Switch label="Required" mb={4} description={`Skip entries if no join found in '${opened}'.`}
            {...form.getInputProps(`config.${opened}.required`, { type: 'checkbox' })} />
            <Switch label="One-To-One" description={`Skip entries on multiple join potentials in '${opened}' found.`}
            {...form.getInputProps(`config.${opened}.oto`, { type: 'checkbox' })} />
            <Switch label="Case Sensitive" mb="xs" description={<Text inline size="xs" c="orange">Warning: Setting this on any secondary also effects the primary.</Text>}
            {...form.getInputProps(`config.${opened}.case`, { type: 'checkbox' })} />
            {provider.Config&&<Divider my="xs" label={`${provider.id} options`} labelPosition="left" />}
            </>}
            {(opened&&provider.Config)&&<provider.Config form={form} name={opened} />}
            </>}
        </Modal>
    )
}

export default function Settings( { form, sources, taken }: {form: UseFormReturnType<Rule>, sources: string[], taken: string[]} ) {
    const { connectors, _connectors } = useContext(SchemaContext);
    const { explorer, explore } = useContext(ExplorerContext);
    const [opened, config] = useState<string|undefined>(undefined);
    const openConfig = (name: string) => {
        const c = form.values.config;
        if (!(name in c) || c[name]===undefined) form.setFieldValue('config', { ...c, [name]: {} });
        config(name);
    }
    const closeConfig = () => {
        if (!opened) return;
        const c = form.values.config;
        const val = Object.values(c[opened] as object).filter(v=>v).length<=0;
        if (val) form.setFieldValue('config', { ...c, [opened]: undefined });
        config(undefined);
    }
    const usable = connectors.filter(c=>c.id!=="proxy").length -1 ;
    const { headers } = useContext(SchemaContext);
    const add = () => form.insertListItem('secondaries', { primary: '', secondaryKey: '', primaryKey: '' } as Secondary);
    const remove  = (index: number) => form.removeListItem('secondaries', index);
    const modify = () => (value: string) => form.setFieldValue('display', `${form.values.display||''}{{${value}}}`);
    const log = form.values.log==="0"?false:!!form.values.log;
    return (
    <Box>
        <Config opened={opened} close={()=>closeConfig()} form={form} />
        {explorer}
        <TextInput
            label="Rule Name"
            leftSection={<IconTag size={16} style={{ display: 'block', opacity: 0.5 }}/>}
            placeholder="Rule Name"
            withAsterisk mb="xs"
            {...form.getInputProps('name')}
        />
        <Grid>
            <Grid.Col span={8}>
                <SelectConnector
                label="Primary Data Source" withAsterisk
                description="Rule conditions will be evaluated for each entry in this connector. For each row, each user, etc."
                clearable
                {...form.getInputProps('primary')}
                disabled={(form.values.secondaries||[]).length>0}
                filter={data=>data.filter(c=>c.id!=="proxy")  }
                rightSection={<ActionIcon disabled={!form.values.primary} onClick={()=>openConfig(form.values.primary)} variant="subtle" color="grey" ><IconSettings size={15}/></ActionIcon>}
                />
            </Grid.Col>
            <Grid.Col span={4}>
                <Select
                label="Primary Key" withAsterisk
                description="Unique identifier for each row."
                placeholder={"id"}
                data={ (form.values.primary in headers) ? headers[form.values.primary] : [] }
                disabled={!form.values.primary} clearable
                searchable leftSection={<IconKey size="1rem" />}
                {...form.getInputProps('primaryKey')}
                />
            </Grid.Col>
        </Grid>
        <Group grow justify="apart" mb="xs" gap="xs">
            <Text size="sm">Secondary Data Sources</Text>
            <Group justify="right" gap="xs" pt="xs" >
                <ActionIcon size="lg" variant="default" disabled={!form.values.primary||taken.length>=usable} onClick={add} ><IconPlus size={15} stroke={1.5} /></ActionIcon>
            </Group>
        </Group>
        <DragDropContext
        onDragEnd={({ destination, source }) => form.reorderListItem('secondaries', { from: source.index, to: destination? destination.index : 0 }) }
        >
        <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
            <div {...provided.droppableProps} style={{top: "auto",left: "auto"}} ref={provided.innerRef}>
            {(form.values.secondaries||[]).map((_, index)=>{
                const primary = form.values.secondaries[index].primary;
                const provider1 = primary ? providers[_connectors[primary].id] : undefined;
                const provider2 = primary ? providers[_connectors[form.values.primary].id] : undefined;
                return <Draggable key={index} index={index} draggableId={index.toString()}>
                    {(provided) => (
                    <Grid align="center" ref={provided.innerRef} mt="xs" {...provided.draggableProps} gutter="xs"
                    style={{ ...provided.draggableProps.style, left: "auto !important", top: "auto !important", }}
                    >
                        <Grid.Col span="content" style={{ cursor: 'grab' }} {...provided.dragHandleProps}  >
                            <Group><IconGripVertical size="1.2rem" /></Group>
                        </Grid.Col>
                        <Grid.Col span="auto">
                            <SelectConnector clearable disabled={!form.values.primary}
                            {...form.getInputProps(`secondaries.${index}.primary`)}
                            filter={data=>data.filter(c=>c.id!=="proxy"&&c.name!==form.values.primary&&!taken.includes(c.name))}
                            />
                        </Grid.Col>
                        <Grid.Col span="auto">
                            <Select
                            placeholder={primary?form.values.primaryKey||'id':'Secondary Key'}
                            data={ (form.values.primary in headers) ? headers[primary] : [] }
                            disabled={!form.values.primary||!primary}
                            searchable leftSection={<IconKey size="1rem" />}
                            rightSection={provider1?<provider1.icon size={18} />:undefined}
                            {...form.getInputProps(`secondaries.${index}.secondaryKey`)}
                            />
                        </Grid.Col>
                        <Grid.Col span="auto">
                            <Select
                            placeholder={primary?form.values.primaryKey||'id':'Primary Key'}
                            data={ (form.values.primary in headers) ? headers[form.values.primary] : [] }
                            disabled={!form.values.primary||!primary}
                            searchable leftSection={<IconKey size="1rem" />}
                            rightSection={provider2?<provider2.icon size={18} />:undefined}
                            {...form.getInputProps(`secondaries.${index}.primaryKey`)}
                            />
                        </Grid.Col>
                        <Grid.Col span="content">
                            <Group justify="right" gap="xs">
                                <ActionIcon color='red' onClick={()=>openConfig(primary)}
                                variant="default" size="lg"
                                disabled={!form.values.primary||!primary}
                                ><IconSettings size={15}/></ActionIcon>
                                <ActionIcon color='red' onClick={()=>remove(index)} variant="default" size="lg"><IconTrash size={15}/></ActionIcon>
                            </Group>
                        </Grid.Col>
                    </Grid>)}
                </Draggable>}
                )
            }
            </div>
            )}
        </Droppable>
        </DragDropContext>
        <TextInput
            label="Entry Display Name"
            description="Displayed on each result row to identify each entry."
            leftSection={<IconTable size={16} style={{ display: 'block', opacity: 0.5 }}/>}
            placeholder="{{username}}"
            mt="xs"
            rightSection={ <ActionIcon onClick={()=>explore(modify, sources)} variant="subtle" ><IconCode size={16} style={{ display: 'block', opacity: 0.8 }} /></ActionIcon> }
            {...form.getInputProps('display')}
        />
        <Switch mt="xs" {...form.getInputProps('enabled', { type: 'checkbox' })} label="Rule Enabled"/>
        <Group grow>
            <Switch mt="xs" label="Logging Enabled"
            checked={log}
            onChange={e=>e.currentTarget.checked?
                form.setFieldValue(`log`, '1'):form.setFieldValue(`log`, undefined)
            }
            />
            {log&&<Select
            placeholder="Log level"
            data={logLevels}
            {...form.getInputProps('log')}
            />}
        </Group>
        <Textarea
            label="Rule Description"
            placeholder="Describe what this rule does. Displayed on the rules overview page."
            mt="xs"
            {...form.getInputProps('description')}
        />
    </Box>
    )
}
