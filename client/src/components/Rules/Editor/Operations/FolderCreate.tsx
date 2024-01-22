import { Box, Switch, TextInput } from "@mantine/core";
import { IconFolderPlus } from "@tabler/icons-react";

export default function FolderCreate( { form, index, explorer, actionType }: ActionItem ) {
    return (
    <Box p="xs" pt={0} >
        <TextInput
            label="Target Folder" withAsterisk
            description="Path of folder to be created."
            placeholder="D:/source/{{username}}/"
            {...form.getInputProps(`${actionType}.${index}.target`)}
            leftSection={<IconFolderPlus size={16} style={{ display: 'block', opacity: 0.8 }}/>}
            rightSection={explorer('target')}
        />
        <Switch label="Recursive"
            description="All parent folders in the path will be created if they do not already exist."
            mt="xs" {...form.getInputProps(`${actionType}.${index}.recursive`, { type: 'checkbox' })}
        />
    </Box>
    )
}
