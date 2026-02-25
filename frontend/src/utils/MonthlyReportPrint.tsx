import { Document, Page, Text, View, StyleSheet, Font, Link } from "@react-pdf/renderer";
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
    paddingTop: 68,
    paddingBottom: 36,
    paddingHorizontal: 36,
    fontSize: 8,
    fontFamily: "NotoSans",
    color: "#000000",
    backgroundColor: "#ffffff",
  },

  // ── HEADER ──────────────────────────────────────────────
  header: {
    position: "absolute",
    top: 14,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 8,
    borderBottom: "2 solid #000000",
  },
  headerLeft: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },
  ownerName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textAlign: "center",
  },
  businessLine: {
    fontSize: 8.5,
    color: "#333333",
    marginTop: 2,
    textAlign: "center",
  },
  address: {
    fontSize: 7.5,
    color: "#555555",
    marginTop: 1.5,
    textAlign: "center",
  },
  statementBlock: {
    alignItems: "flex-end",
  },
  statementLabel: {
    fontSize: 6.5,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  statementText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 1,
  },

  // ── TABLE HEADER ─────────────────────────────────────────
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eeeeee",
    paddingVertical: 4.5,
    paddingHorizontal: 6,
    marginTop: 8,
    fontSize: 7.8,
    fontWeight: "bold",
    color: "#000000",
    borderTop: "1 solid #000000",
    borderBottom: "1 solid #000000",
  },

  // ── ROW ──────────────────────────────────────────────────
  row: {
    flexDirection: "row",
    paddingVertical: 3.6,
    paddingHorizontal: 6,
    borderBottom: "0.5 solid #dddddd",
    alignItems: "center",
  },
  rowAlt: { backgroundColor: "#f9f9f9" },

  // ── COLUMNS ──────────────────────────────────────────────
  cellSerial:  { width: "5%",  fontSize: 7.5, color: "#666666" },
  cellDate:    { width: "11%", fontSize: 7.8, color: "#222222" },
  cellRoute:   { width: "40%", flexDirection: "row", alignItems: "center" },
  cellVehicle: { width: "17%" },
  cellType:    { width: "13%" },
  cellAmount:  { width: "14%", textAlign: "right", fontWeight: "bold", color: "#000000", fontSize: 8.2 },

  routePoint: {
    fontSize: 8.2,
    color: "#000000",
  },
  routeSep: {
    fontSize: 8,
    color: "#aaaaaa",
    paddingHorizontal: 4,
  },

  vehicleText: {
    fontSize: 7.2,
    fontWeight: "bold",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  vehicleEmpty: {
    fontSize: 7.5,
    color: "#cccccc",
  },

badgeReturn: {
  width: 42,
  textAlign: "center",
  paddingVertical: 1.5,
  borderRadius: 2,
  fontSize: 6.3,
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: 0.2,
  backgroundColor: "#e8e8e8",
  color: "#000000",
  border: "0.5 solid #999999",
},
badgeOneWay: {
  width: 42,
  textAlign: "center",
  paddingVertical: 1.5,
  borderRadius: 2,
  fontSize: 6.3,
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: 0.2,
  backgroundColor: "#ffffff",
  color: "#444444",
  border: "0.5 solid #bbbbbb",
},

  // ── SUMMARY ──────────────────────────────────────────────
  summarySection: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalBox: {
    width: "34%",
    borderTop: "1.5 solid #000000",
    paddingTop: 6,
    paddingHorizontal: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#000000",
  },

  // ── FOOTER ──────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 14,
    left: 36,
    right: 36,
    paddingTop: 5,
    borderTop: "0.5 solid #cccccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerNote: { color: "#999999", fontSize: 7 },
  pageNum:    { color: "#999999", fontSize: 7 },
  appLink:    { color: "#555555", fontSize: 7.5, textDecoration: "none" },
  sign:       { color: "#555555", fontSize: 7.5 },
});

interface Props {
  trips: Trip[];
  monthName: string;
  year: number | string;
  headerDetails?: {
    ownerName?: string;
    businessLine?: string;
    address?: string;
  };
}

export const MonthlyReportPDF = ({ trips, monthName, year, headerDetails }: Props) => {
  const totalFare    = trips.reduce((sum, t) => sum + Number(t.fare || 0), 0);
  const ownerName    = headerDetails?.ownerName?.trim()    || "TRIPPY TECHNOLOGIES";
  const businessLine = headerDetails?.businessLine?.trim() || "Web Services Provider";
  const address      = headerDetails?.address?.trim()      || "Vadodara, Gujarat";

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── HEADER ── */}
        <View style={styles.header} fixed>
          {/* Left: name / business / address stacked */}
          <View style={styles.headerLeft}>
            <Text style={styles.ownerName}>{ownerName}</Text>
            <Text style={styles.businessLine}>{businessLine}</Text>
            <Text style={styles.address}>{address}</Text>
          </View>

          {/* Right: statement label + month year */}
          <View style={styles.statementBlock}>
            <Text style={styles.statementLabel}>Monthly Statement</Text>
            <Text style={styles.statementText}>{monthName} {year}</Text>
          </View>
        </View>

        {/* ── TABLE HEADER ── */}
        <View style={styles.tableHeader} fixed>
          <Text style={styles.cellSerial}>Sr.</Text>
          <Text style={styles.cellDate}>Date</Text>
          <Text style={styles.cellRoute}>Route</Text>
          <Text style={styles.cellVehicle}>Vehicle No.</Text>
          <Text style={styles.cellType}>Type</Text>
          <Text style={styles.cellAmount}>Amount</Text>
        </View>

        {/* ── ROWS ── */}
        {trips.map((trip, i) => (
          <View
            key={i}
            style={i % 2 !== 0 ? [styles.row, styles.rowAlt] : styles.row}
            wrap={false}
          >
            <Text style={styles.cellSerial}>{i + 1}</Text>

            <Text style={styles.cellDate}>{formatDate(trip.tripDate)}</Text>

            <View style={styles.cellRoute}>
              <Text style={styles.routePoint}>{trip.startPoint}</Text>
              <Text style={styles.routeSep}>—</Text>
              <Text style={styles.routePoint}>{trip.endPoint}</Text>
            </View>

            <Text style={[styles.cellVehicle, trip.numberPlate ? styles.vehicleText : styles.vehicleEmpty]}>
              {trip.numberPlate ? trip.numberPlate.toUpperCase() : "—"}
            </Text>

            <View style={styles.cellType}>
              <Text style={trip.returnTrip ? styles.badgeReturn : styles.badgeOneWay}>
                {trip.returnTrip ? "Return" : "One-Way"}
              </Text>
            </View>

            <Text style={styles.cellAmount}>
              ₹ {Number(trip.fare).toLocaleString("en-IN")}
            </Text>
          </View>
        ))}

        {/* ── SUMMARY ── */}
        <View style={styles.summarySection} wrap={false}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>
              ₹ {totalFare.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerNote}> {"Generated from "}
              <Link src="https://trippyyer.vercel.app" style={styles.appLink}>
            Trippy
          </Link>
          </Text>
          <Text
            style={styles.pageNum}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          />
            <Text style={styles.sign}>Authorized Signatory</Text>
        </View>

      </Page>
    </Document>
  );
};
