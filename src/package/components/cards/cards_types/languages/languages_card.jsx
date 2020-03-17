import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ProfileCard } from '../../../commons/profile_card/profile_card';
import { LanguagesFront } from './languages_front/languages_front';
import { LanguagesBack } from './languages_back/languages_back';
import { mapLanguagesFromJsonResume, mapLanguagesToJsonResume } from './data/mapping';
import { LanguagesCardEditDialog } from './languages_edit_dialog/languages_card_edit_dialog';
import { LanguageValidator, validateLanguagesComplete } from './data/validator';
import { DeveloperProfileContext } from '../../../../utils/context/contexts';
import { useCallbackOpen } from '../../../hooks/use_callback_open';

const LanguagesCardComponent = ({ variant, side }) => {
    const { data, isEditing, onEdit, mode } = useContext(DeveloperProfileContext);
    const defaultMappedData = useMemo(() => mapLanguagesFromJsonResume(data), [data]);
    const [mappedData, setMappedData] = useState(defaultMappedData);

    useEffect(() => {
        setMappedData(defaultMappedData);
    }, [defaultMappedData]);

    const onDialogEdited = useCallback(editedData => {
        onEdit(mapLanguagesToJsonResume(editedData));
    }, []);

    const isComplete = useMemo(() => validateLanguagesComplete(mappedData), [mappedData]);

    const [openNewLanguageDialog, setNewLanguageDialogOpened] = useCallbackOpen();

    if (!isComplete && mode !== 'edit') {
        return null;
    }
    return (
        <ProfileCard
            isEditingProfile={isEditing}
            isComplete={isComplete}
            data={mappedData}
            sides={{
                front: props => <LanguagesFront handleAddButtonClick={setNewLanguageDialogOpened} {...props} />,
                back: props => <LanguagesBack handleAddButtonClick={setNewLanguageDialogOpened} {...props} />
            }}
            variant={variant}
            side={side}
            openEditDialog={openNewLanguageDialog}
            editDialog={{
                component: LanguagesCardEditDialog,
                validationSchema: LanguageValidator,
                onEdit: onDialogEdited
            }}
        />
    );
};

export const LanguagesCard = LanguagesCardComponent;
