import { Box, Switch, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconFolderX } from "@tabler/icons-react";
import { IconFolderSymlink } from "@tabler/icons-react";

export default function MoveFolder( { form, index, explorer }:{ form: UseFormReturnType<Rule>, index: number, explorer: (key: string) => JSX.Element } ) {
    return (
    <Box p="xs" pt={0} >
        <TextInput
            label="Source Folder" withAsterisk
            description="Path of folder to be moved."
            placeholder="D:/source/{{username}}/"
            {...form.getInputProps(`actions.${index}.source`)}
            leftSection={<IconFolderX size={16} style={{ display: 'block', opacity: 0.8 }}/>}
            rightSection={explorer('source')}
        />
        <Switch label="Validate Path"
        mt="xs" {...form.getInputProps(`actions.${index}.validate`, { type: 'checkbox' })}
        />
        <TextInput
            label="Target Folder" withAsterisk
            description="Destination path where copy will be placed."
            placeholder="E:/destination/{{username}}/"
            {...form.getInputProps(`actions.${index}.target`)}
            leftSection={<IconFolderSymlink size={16} style={{ display: 'block', opacity: 0.8 }}/>}
            rightSection={explorer('target')}
        />
        <Switch label="Should Overwrite"
        mt="xs" {...form.getInputProps(`actions.${index}.overwrite`, { type: 'checkbox' })}
        />
    </Box>
    )
}
