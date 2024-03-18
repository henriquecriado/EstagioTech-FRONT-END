import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import api from "../../../../../service/api";
import { useEffect, useState } from "react";
import { Combobox, ComboboxProps } from "../../../../../components/ui/combobox";
import { TipoDocumentoProps } from "@/pages/Admin/TipoDocumento/TableTipoDocumento/table/columns";
import { TipoEstagioProps } from "@/pages/Admin/TipoEstagio/TableTipoEstagio/table/columns";

const formSchema = z.object({
    idTipoDocumento: z.number(),
    idTipoEstagio: z.number(),
});

type FormCadastroProps = z.infer<typeof formSchema>;

const CadastroDocumentoNecessario = ({ data }: { data: FormCadastroProps }) => {
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [dataComboBoxD, setDataComboBoxD] = useState<ComboboxProps[]>([]);
    const [dataComboBoxE, setDataComboBoxE] = useState<ComboboxProps[]>([]);

    const [valueComboBoxD, setValueComboBoxD] = useState("");
    const [valueComboBoxE, setValueComboBoxE] = useState("");

    const form = useForm<FormCadastroProps>({
        resolver: zodResolver(formSchema),
        values: {
            idTipoDocumento: data.idTipoDocumento,
            idTipoEstagio: data.idTipoEstagio,
        },
        defaultValues: {
            idTipoDocumento: 0,
            idTipoEstagio: 0,
        },
    });

    useEffect(() => {
        (async () => {
            const tipoDocumentoSelecionado = data.idTipoDocumento;
            const tipoEstagioSelecionado = data.idTipoEstagio;
            const checkIsedit = Object.keys(data).length;
            if (checkIsedit > 0) setIsEdit(true);
            if (tipoDocumentoSelecionado && tipoEstagioSelecionado) {
                setValueComboBoxD(tipoDocumentoSelecionado.toString());
                setValueComboBoxE(tipoEstagioSelecionado.toString());
            }

            const resp: TipoDocumentoProps[] = (await api.get("tipodocumento")).data;
            const resptypeEstagio: TipoEstagioProps[] = (await api.get("tipoestagio")).data;

            setDataComboBoxD(
                resp.map((item) => {
                    return {
                        value: item.descricaoTipoDocumento.toString(),
                        label: item.descricaoTipoDocumento,
                    };
                })
            );
            setDataComboBoxE(
                resptypeEstagio.map((item) => {
                    return {
                        value: item.idTipoEstagio.toString(),
                        label: item.descricaoTipoEstagio,
                    };
                })
            );
        })();
    }, [data]);


    async function onSubmit(values: FormCadastroProps) {
        const dataTipoDocumento = { ...values, idTipoDocumento: Number(valueComboBoxD) };
        const dataTipoEstagio = { ...values, idTipoEstagio: Number(valueComboBoxE) };
        isEdit
            ? await api
                .put(`/documentonecessario/${data.idTipoDocumento, data.idTipoEstagio}`, {
                    ...values,
                    idTipoDocumento: data.idTipoDocumento,
                    idTipoEstagio: data.idTipoEstagio,
                })
                .finally(() => navigate("/dashboard/documentonecessario"))
            : await api
                .post("/documentonecessario", { dataTipoDocumento, dataTipoEstagio })
                .finally(() => navigate("/dashboard/documentonecessario"));
    }
    return (
        <Card className="p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="idTipoDocumento"
                            render={({ field }) => (
                                <FormItem className="mt-5">
                                    <FormLabel>ID DO TIPO DOCUMENTO</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            data={dataComboBoxD}
                                            value={valueComboBoxD}
                                            setValue={setValueComboBoxD}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="idTipoEstagio"
                            render={({ field }) => (
                                <FormItem className="mt-5">
                                    <FormLabel>ID DO TIPO ESTÁGIO</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            data={dataComboBoxD}
                                            value={valueComboBoxE}
                                            setValue={setValueComboBoxE}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex gap-4">
                        <Button type="submit">
                            {!isEdit ? "Salvar alterações" : "Cadastrar"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/adm/documentonecessario")}
                        >
                            Voltar
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default CadastroDocumentoNecessario;
