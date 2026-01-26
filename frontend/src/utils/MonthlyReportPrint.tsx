import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { Trip } from "../types";
import { formatDate } from "./FormatDate";

Font.register({
  family: "NotoSans",
  fonts: [
    { src: "/fonts/NotoSans-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/NotoSans-Bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 72,
    paddingBottom: 50,
    paddingHorizontal: 36,
    fontSize: 10,
    fontFamily: "NotoSans",
    color: "#111827",
  },
  header: {
    position: "absolute",
    top: 16,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 6,
    borderBottom: "2 solid #f97316",
  },
  headerLeft: { gap: 2 },
  title: { fontSize: 18, fontWeight: "bold", letterSpacing: 0.5 },
  subtitle: { fontSize: 11, color: "#f97316", fontWeight: "bold" },
  address: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  statementText: { fontSize: 11, fontWeight: "bold" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    color: "#1f2937",
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginTop: 10,
    fontSize: 10,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottom: "1 solid #e5e7eb",
    alignItems: "center",
  },
  cellDate: { width: "15%" },
  cellRoute: { width: "45%", flexDirection: "column", justifyContent: "center" },
  cellType: { width: "15%" },
  cellAmount: { width: "25%", textAlign: "right", fontWeight: "bold" },
  routeText: { fontSize: 10 },
  routeSeparator: { color: "#7c828c", fontWeight: "normal" },

  
plateWrapper: {
  marginTop: 1,           
  // paddingVertical: 1,   
  paddingHorizontal: 3,   
  backgroundColor: "#f3f4f6", 
  alignSelf: "flex-start",  
},
plateText: {
  fontSize: 7,               
  fontWeight: "normal",
  color: "#111827",          
  textTransform: "uppercase",
},


  summarySection: { marginTop: 12, flexDirection: "row", justifyContent: "flex-end" },
  totalBox: {
    width: "40%",
    borderTop: "1.5 solid #f97316",
    borderBottom: "1.5 solid #f97316",
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff9f2",
  },
  totalLabel: { fontWeight: "bold", fontSize: 10, color: "#c2410c" },
  totalValue: { fontWeight: "bold", fontSize: 11, color: "#111827" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    paddingTop: 8,
    borderTop: "1 solid #e5e7eb",
    flexDirection: "row",
    justifyContent: "flex-end",
    fontSize: 10,
  },
  sign: { color: "#6b7280" },
});

interface Props {
  trips: Trip[];
  monthName: string;
  year: number | string;
}

export const MonthlyReportPDF = ({ trips, monthName, year }: Props) => {
  const totalFare = trips.reduce((sum, t) => sum + Number(t.fare || 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>NARESH C BHANDARI</Text>
            <Text style={styles.subtitle}>Tempo Carrier & Transport Services</Text>
            <Text style={styles.address}>Sarigam Fansa Char Rasta, Umbergaon, Gujarat</Text>
          </View>
          <Text style={styles.statementText}>
            Statement - {monthName} {year}
          </Text>
        </View>

        {/* TABLE HEADER */}
        <View style={styles.tableHeader} fixed>
          <Text style={styles.cellDate}>Date</Text>
          <Text style={styles.cellRoute}>Route / Vehicle</Text>
          <Text style={styles.cellType}>Type</Text>
          <Text style={styles.cellAmount}>Amount</Text>
        </View>

        {/* TABLE BODY */}
        {trips.map((trip, i) => (
          <View key={i} style={styles.row} wrap={false}>
            <Text style={styles.cellDate}>{formatDate(trip.tripDate)}</Text>

            <View style={styles.cellRoute}>
              <Text style={styles.routeText}>
                {trip.startPoint}
                <Text style={styles.routeSeparator}> to </Text>
                {trip.endPoint}
              </Text>

              {/* Number Plate */}
              {trip.numberPlate && (
  <View style={styles.plateWrapper}>
    <Text style={styles.plateText}>{trip.numberPlate.toUpperCase()}</Text>
  </View>
)}

            </View>

            <Text style={styles.cellType}>{trip.returnTrip ? "Return" : "One-Way"}</Text>

            <Text style={styles.cellAmount}>
              ₹ {Number(trip.fare).toLocaleString("en-IN")}
            </Text>
          </View>
        ))}

        {/* SUMMARY */}
        <View style={styles.summarySection} wrap={false}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>
              ₹ {totalFare.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <Text style={styles.sign}>Authorized Signatory</Text>
        </View>
      </Page>
    </Document>
  );
};
