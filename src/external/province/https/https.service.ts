import axios from 'axios'

const TH_PROVICE_BASE_URL = process.env['TH_PROVINCE_URL']

export const getProvinces = async () => {
  const { data } = await axios.get(`${TH_PROVICE_BASE_URL}/api_province.json`)

  return data
}

export const getDistrict = async () => {
  const { data } = await axios.get(`${TH_PROVICE_BASE_URL}/api_amphure.json`)
  return data
}

export const getSubDistrict = async () => {
  const { data } = await axios.get(`${TH_PROVICE_BASE_URL}/api_tambon.json`)
  return data
}
